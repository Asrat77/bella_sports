class AdminMagicLinkJob < ApplicationJob
  queue_as :mailers

  def perform(admin_id, token)
    admin = Admin.find(admin_id)
    AdminMailer.magic_link(admin, token).deliver_now
  end
end
