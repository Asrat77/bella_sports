class AdminSerializer < ApplicationSerializer
  attributes :id,
    :email,
    :name,
    :active,
    :created_at
end
