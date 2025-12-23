module Authenticatable
  extend ActiveSupport::Concern

  included do
    # Override in controllers that require authentication
    # before_action :require_admin!
  end

  private

  def require_admin!
    return if Current.admin.present?

    render json: { error: "Authentication required" }, status: :unauthorized
  end

  def current_admin
    Current.admin
  end
end
