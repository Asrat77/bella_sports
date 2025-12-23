module Filterable
  extend ActiveSupport::Concern

  private

  def filter_records(data)
    # Category filter
    data = data.where(category: params[:category]) if params[:category].present?

    # League filter
    data = data.where(league: params[:league]) if params[:league].present?

    # Search query (pg_search)
    data = data.search(params[:q]) if params[:q].present? && data.respond_to?(:search)

    # Status filter
    data = data.where(status: params[:status]) if params[:status].present?

    # Date range filter
    if params[:start_date].present? && params[:end_date].present?
      data = data.where(created_at: params[:start_date]..params[:end_date])
    end

    # Payment status filter
    data = data.where(payment_status: params[:payment_status]) if params[:payment_status].present?

    data
  end
end
