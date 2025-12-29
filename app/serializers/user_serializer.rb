class UserSerializer < ApplicationSerializer
  attributes :id, :telegram_id, :first_name, :last_name, :username, :email, :phone_number,
    :photo_url, :full_name, :store_credit_balance, :store_credit_in_etb, :telegram_notification_available?,
    :phone_verified?, :requires_phone_verification?

  def full_name
    object.full_name
  end

  def store_credit_in_etb
    object.store_credit_in_etb
  end

  def telegram_notification_available?
    object.telegram_notification_available?
  end

  def phone_verified?
    object.phone_verified?
  end

  def requires_phone_verification?
    object.requires_phone_verification?
  end
end
