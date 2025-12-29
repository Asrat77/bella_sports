class ProcessTelegramMessageJob < ApplicationJob
  queue_as :default

  def perform(update)
    TelegramBotService.handle_webhook(update)
  rescue => e
    # Log the error but don't fail the job
    Rails.logger.error "Error processing Telegram message: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
  end
end
