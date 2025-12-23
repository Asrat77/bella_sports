class Api::V1::OrdersController < Api::V1::BaseController
  def create
    # Override create to handle order-specific logic
    obj = @clazz.new(order_params)

    # Add order items
    if params[:order][:items].present?
      params[:order][:items].each do |item_params|
        product = Product.find(item_params[:product_id])
        customization = item_params[:customization]

        obj.add_item(
          product: product,
          size: item_params[:size],
          quantity: item_params[:quantity] || 1,
          customization: customization
        )
      end
    end

    if obj.save
      @obj = obj

      # Send confirmation email via background job
      OrderConfirmationJob.perform_later(obj.id)

      # Reload with associations
      obj = @clazz.includes(order_items: {}, order_status: {}, branch: {}).find(obj.id)
      @obj = obj

      render_success(data: obj, serializer_options: {}, status: :created)
    else
      render_error(errors: obj.errors.full_messages, status: :unprocessable_entity)
    end
  rescue => e
    Rails.logger.error "Order creation failed: #{e.message}"
    render_error(error: "Order creation failed", status: :internal_server_error)
  end

  # Public order tracking endpoint
  def track
    order = @clazz.find_by_tracking!(params[:tracking_code])

    render_success(
      data: order,
      serializer_options: {
        include: {
          order_items: {},
          order_status: {},
          branch: {}
        }
      }
    )
  rescue ActiveRecord::RecordNotFound
    render_error(error: "Order not found", status: :not_found)
  end

  private

  def order_params
    params.expect(order: [
      :customer_name,
      :customer_phone,
      :email,
      :delivery_method,
      :branch_id,
      :area,
      :landmark,
      :house_number,
      :delivery_notes,
      items: [
        :product_id,
        :size,
        :quantity,
        customization: [ :name, :number ]
      ]
    ])

    params[:order].tap do |p|
      # Clean phone number
      p[:customer_phone] = p[:customer_phone].to_s.gsub(/\D/, "")
    end
  end
end
