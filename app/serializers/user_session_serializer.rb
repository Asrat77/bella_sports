class UserSessionSerializer < ApplicationSerializer
  attributes :id, :expires_at, :last_used_at, :expired?, :active?, :user

  def user
    return nil unless object.user
    UserSerializer.new(object.user, {})
  end

  def expired?
    object.expired?
  end

  def active?
    object.active?
  end
end
