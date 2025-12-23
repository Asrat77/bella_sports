module Statusable
  extend ActiveSupport::Concern

  included do
    has_one :order_status, dependent: :destroy

    validates :status, inclusion: { in: %w[pending confirmed delivered cancelled] }, allow_nil: true

    # Define status transitions
    STATUS_TRANSITIONS = {
      "pending" => %w[confirmed cancelled],
      "confirmed" => %w[delivered cancelled],
      "delivered" => [],
      "cancelled" => []
    }
  end

  def update_status!(new_status, creator:)
    transaction do
      # Validate transition
      current_status = status || "pending"
      unless STATUS_TRANSITIONS[current_status].include?(new_status)
        raise ArgumentError, "Invalid status transition from #{current_status} to #{new_status}"
      end

      # Create new status record
      create_order_status!(status: new_status, creator: creator)

      # Send notification
      send_status_notification(new_status) if respond_to?(:send_status_notification)
    end
  end

  def status
    order_status&.status || "pending"
  end

  def can_transition_to?(new_status)
    current_status = status
    STATUS_TRANSITIONS[current_status].include?(new_status)
  end
end
