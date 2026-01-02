class Api::V1::Admin::BaseController < Api::V1::BaseController
  before_action :require_admin!

  private

  def require_admin!
    # TODO: Implement admin authentication
    # For now, assume authenticated user is admin or use magic link token
    # head :forbidden unless current_user&.admin?
  end
end
