class OrderMailer < ApplicationMailer
  def confirmation(order)
    @order = order
    @tracking_url = api_v1_order_track_url(@order.tracking_code, tracking_code: @order.tracking_code)

    mail(
      to: @order.email || "#{@order.customer_phone}@bellasports.et", # SMS gateway fallback
      subject: "Order ##{@order.tracking_code} Confirmation - Bella Sports"
    )
  end

  def status_update(order, status)
    @order = order
    @status = status
    @tracking_url = api_v1_order_track_url(@order.tracking_code, tracking_code: @order.tracking_code)

    mail(
      to: @order.email || "#{@order.customer_phone}@bellasports.et",
      subject: "Order ##{@order.tracking_code} Status Update - Bella Sports"
    )
  end
end
