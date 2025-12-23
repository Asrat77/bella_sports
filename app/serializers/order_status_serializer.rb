class OrderStatusSerializer < ApplicationSerializer
  attributes :id,
    :status,
    :created_at,
    :updated_at

  has_one :creator, serializer: AdminSerializer
end
