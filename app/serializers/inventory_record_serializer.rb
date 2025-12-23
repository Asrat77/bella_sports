class InventoryRecordSerializer < ApplicationSerializer
  attributes :id,
    :size,
    :quantity,
    :created_at,
    :updated_at
end
