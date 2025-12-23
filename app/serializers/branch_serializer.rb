class BranchSerializer < ApplicationSerializer
  attributes :id,
    :name,
    :address,
    :phone,
    :active,
    :sort_order
end
