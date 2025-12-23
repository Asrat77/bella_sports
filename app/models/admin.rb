class Admin < ApplicationRecord
  has_secure_password

  has_many :magic_links, dependent: :destroy
  has_many :order_statuses, foreign_key: :creator_id

  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :name, presence: true

  scope :active, -> { where(active: true) }

  def generate_magic_link!
    magic_links.create!(
      token: SecureRandom.urlsafe_base64(32),
      expires_at: 15.minutes.from_now
    )
  end

  def valid_magic_link?(token)
    magic_links
      .where(token: token, used: false)
      .where("expires_at > ?", Time.current)
      .exists?
  end

  def consume_magic_link!(token)
    magic_link = magic_links.find_by!(token: token)
    magic_link.update!(used: true)
    magic_link
  end
end
