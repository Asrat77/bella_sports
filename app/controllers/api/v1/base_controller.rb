class Api::V1::BaseController < ApplicationController
  include Common

  attr_reader :current_user

  protected

  def authenticate_user!
    token = request.headers["Authorization"]&.sub(/^Bearer /, "")
    return if token.blank?

    user_session = UserSession.active.find_by(token: token)
    return unless user_session

    @current_user = user_session.user
    user_session.update!(last_used_at: Time.current)
  end

  def require_authenticate_user!
    token = request.headers["Authorization"]&.sub(/^Bearer /, "")
    return head :unauthorized if token.blank?

    user_session = UserSession.active.find_by(token: token)
    return head :unauthorized unless user_session

    @current_user = user_session.user
    user_session.update!(last_used_at: Time.current)
  end

  def current_user_signed_in?
    @current_user.present?
  end
end
