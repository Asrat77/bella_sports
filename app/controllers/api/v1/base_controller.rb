class Api::V1::BaseController < ApplicationController
  include Common

  attr_reader :current_user

  protected

  def authenticate_user!
    token = request.headers["Authorization"]&.sub(/^Bearer /, "")
    @user_session = UserSession.authenticate(token)

    if @user_session
      @current_user = @user_session.user
      @user_session.update!(last_used_at: Time.current)
    end
  end

  def require_authenticate_user!
    authenticate_user!
    head :unauthorized unless current_user_signed_in?
  end

  def current_user_signed_in?
    @current_user.present?
  end
end
