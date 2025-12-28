class Api::V1::ProductsController < Api::V1::BaseController
  # Override eager loaded associations
  def eager_loaded_associations
    %i[product_badges inventory_records]
  end

  # Define what columns can be ordered by
  def allowed_order_columns
    %w[id created_at updated_at name price category league]
  end

  # Custom index action for products with special filtering
  def index
    # Start with active products only
    data = @clazz.active

    super do
      data
    end
  end

  # Search endpoint
  def search
    data = @clazz.active

    if params[:q].present?
      data = data.search(params[:q])
    end

    index do
      data
    end
  end

  # Categories endpoint
  def categories
    categories = @clazz.active.distinct.pluck(:category)

    render_success(data: categories, serializer_options: {})
  end

  private

  def model_params
    params.expect(product: [ :name, :price, :category, :league, :customization_price, :description, :front_image, :back_image ]).permit!
  end
end
