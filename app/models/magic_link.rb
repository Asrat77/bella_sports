class MagicLink < ApplicationRecord
  belongs_to :admin

  validates :token, presence: true, uniqueness: true
  validates :expires_at, presence: true

  scope :valid, -> { where(used: false).where("expires_at > ?", Time.current) }
  scope :expired, -> { where("expires_at <= ?", Time.current) }
  scope :used, -> { where(used: true) }

  def expired?
    expires_at <= Time.current
  end

  def mark_as_used!
    update!(used: true)
  end
end
