class Api::V1::TelegramWebhooksController < ApplicationController
  def create
    update = JSON.parse(request.body.read)

    # Verify webhook is from Telegram (optional but recommended)
    return head :ok unless verify_webhook?(update)

    # Process webhook asynchronously
    ProcessTelegramMessageJob.perform_later(update)

    head :ok
  rescue JSON::ParserError
    head :bad_request
  end

  private

  def verify_webhook?(update)
    # Basic verification - you can add more sophisticated checks
    update.is_a?(Hash) && update.key?("update_id")
  end
end
