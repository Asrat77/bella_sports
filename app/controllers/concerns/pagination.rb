module Pagination
  extend ActiveSupport::Concern

  def default_per_page
    20
  end

  def page_no
    params[:page]&.to_i || 1
  end

  def per_page
    [ params[:per_page]&.to_i || default_per_page, 100 ].min  # Max 100 per page
  end

  def paginate_offset
    (page_no - 1) * per_page
  end

  def order_by
    allowed_columns = if respond_to?(:allowed_order_columns, true)
      allowed_order_columns
    else
      %w[id created_at updated_at]
    end
    requested_column = params.fetch(:order_by, "created_at").to_s
    allowed_columns.include?(requested_column) ? requested_column : "created_at"
  end

  def order_direction
    if %w[asc desc].include?(params.fetch(:order_direction, "desc").to_s.downcase)
      params.fetch(:order_direction, "desc").to_s.downcase
    else
      "desc"
    end
  end

  def paginate
    ->(it) { it.limit(per_page).offset(paginate_offset).order("#{order_by} #{order_direction}") }
  end

  # Generate HATEOAS pagination links
  def pagination_links(total_pages)
    base_path = request.path
    current_params = request.query_parameters.except("page")

    links = {
      first: build_page_url(base_path, current_params, 1),
      last: build_page_url(base_path, current_params, total_pages)
    }

    links[:prev] = build_page_url(base_path, current_params, page_no - 1) if page_no > 1
    links[:next] = build_page_url(base_path, current_params, page_no + 1) if page_no < total_pages

    links
  end

  private

  def build_page_url(base_path, params, page)
    params_with_page = params.merge(page: page, per_page: per_page, order_by: order_by, order_direction: order_direction)
    "#{base_path}?#{params_with_page.to_query}"
  end
end
