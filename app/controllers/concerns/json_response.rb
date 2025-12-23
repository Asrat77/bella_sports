module JsonResponse
  extend ActiveSupport::Concern

  private

  def render_success(data:, serializer_options: {}, status: :ok)
    # Determine serializer
    serializer = determine_serializer(data)

    # Render with ActiveModel::Serializer
    render(
      json: serializer.new(data, serializer_options).as_json,
      status: status
    )
  end

  def render_error(error: nil, errors: nil, status: :internal_server_error)
    response_data = {}

    if error
      response_data[:error] = error
    elsif errors
      response_data[:errors] = Array(errors)
    end

    render json: response_data, status: status
  end

  def determine_serializer(data)
    # If data is a single record
    if data.is_a?(ActiveRecord::Base)
      serializer_for_class(data.class)
    elsif data.is_a?(Array) && data.first.is_a?(ActiveRecord::Base)
      serializer_for_class(data.first.class)
    elsif data.is_a?(ActiveRecord::Relation)
      serializer_for_class(data.klass)
    else
      # Fallback to no serializer
      nil
    end
  end

  def serializer_for_class(klass)
    # Try to find serializer based on class name
    "#{klass.name}Serializer".constantize
  rescue NameError
    # Fallback to ApplicationSerializer or no serializer
    ApplicationSerializer
  end
end
