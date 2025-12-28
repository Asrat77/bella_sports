class User < ApplicationRecord
  has_many :user_sessions, dependent: :destroy
  has_many :orders, dependent: :restrict_with_error

  validates :telegram_id, presence: true, uniqueness: true
  validates :first_name, presence: true
  validates :email, uniqueness: { allow_blank: true }
  validates :phone_number, uniqueness: { allow_blank: true }, format: { with: /\A\d{9}\z/, allow_blank: true }

  scope :active, -> { where(active: true) }

  def generate_session!
    user_sessions.create!(
      token: SecureRandom.urlsafe_base64(32),
      expires_at: 30.days.from_now
    )
  end

  def valid_session?(token)
    user_sessions
      .where(token: token)
      .where("expires_at > ?", Time.current)
      .exists?
  end

  def consume_session!(token)
    session = user_sessions.find_by!(token: token)
    session.update!(last_used_at: Time.current)
    session
  end

  def full_name
    "#{first_name} #{last_name}".strip
  end

  def store_credit_in_etb
    store_credit_balance / 100.0
  end

  def telegram_notification_available?
    username.present?
  end
end
