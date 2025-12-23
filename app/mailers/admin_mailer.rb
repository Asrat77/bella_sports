class AdminMailer < ApplicationMailer
  def magic_link(admin, token)
    @admin = admin
    @token = token
    @magic_link_url = admin_verify_admin_url(admin, token: @token)

    mail(
      to: @admin.email,
      subject: "Bella Sports Admin Login Link"
    )
  end
end
