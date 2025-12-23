class OrderStatusNotificationJob < ApplicationJob
  queue_as :mailers

  def perform(order_id, status)
    order = Order.find(order_id)
    OrderMailer.status_update(order, status).deliver_now
  end
end
