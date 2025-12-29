class UserSession < ApplicationRecord
  belongs_to :user
  
  attr_accessor :token

  validates :token_digest, presence: true, uniqueness: true
  validates :expires_at, presence: true

  before_validation :digest_token, if: -> { token.present? }

  scope :active, -> { find_by_sql("SELECT * FROM user_sessions WHERE expires_at > NOW()") } # Just kidding, let's keep it AR
  scope :active, -> { where("expires_at > ?", Time.current) }
  scope :expired, -> { where("expires_at <= ?", Time.current) }

  def self.authenticate(token)
    return nil if token.blank?
    active.find_by(token_digest: digest(token))
  end

  def self.digest(token)
    Digest::SHA256.hexdigest(token)
  end

  def expired?
    expires_at <= Time.current
  end

  def active?
    !expired?
  end

  private

  def digest_token
    self.token_digest = self.class.digest(token)
  end
end
