module Common
  extend ActiveSupport::Concern

  # Mixins for common functionality
  include Pagination
  include JsonResponse
  include Filterable
  include Authenticatable

  included do
    # Set model class based on controller name
    before_action :set_clazz

    # Find object by ID for show/update/destroy actions
    before_action :set_object, only: %i[show update destroy]
  end

  # ============== CRUD Actions ==============

  def index
    data = nil
    options = {}

    # Support block-yielding for flexibility
    if block_given?
      incoming = yield
      if incoming.is_a?(Array)
        data, options = incoming
      elsif incoming.is_a?(Hash)
        options = incoming
      else
        data = incoming
      end
    else
      data = @clazz.all
    end

    # Apply eager loading if defined in controller
    data = data.includes(eager_loaded_associations) if eager_loaded_associations.present?

    # Apply filtering (pg_search)
    data = filter_records(data)

    # Get total count before pagination
    total_count = data.count if params[:page]

    # Apply pagination
    data = data.then(&paginate) if params[:page]

    # Add serializer includes for index action
    includes = serializer_includes_for_action(:index)
    options[:include] = includes if includes.present?

    # Add pagination metadata
    if params[:page]
      total_pages = (total_count.to_f / per_page).ceil
      count = data.is_a?(Array) ? data.length : data.count

      options[:pagination] = {
        current_page: page_no,
        per_page: per_page,
        count: count,
        total_count: total_count,
        total_pages: total_pages,
        links: pagination_links(total_pages)
      }
    end

    render_success(data: data, serializer_options: options)
  end

  def show
    data = nil
    options = {}

    if block_given?
      incoming = yield
      if incoming.is_a?(Array)
        data, options = incoming
      elsif incoming.is_a?(Hash)
        data = @obj
        options = incoming
      else
        data = incoming
      end
    else
      data = @obj
    end

    # Reload with eager loads if needed
    data = @clazz.includes(eager_loaded_associations).find(params[:id]) if data.is_a?(@clazz) && eager_loaded_associations.present?

    includes = serializer_includes_for_action(:show)
    options[:include] = includes if includes.present?

    render_success(data: data, serializer_options: options)
  rescue ActiveRecord::RecordNotFound
    render_error(error: "#{@clazz.name} not found", status: :not_found)
  end

  def create
    obj = nil
    options = {}

    if block_given?
      incoming = yield
      if incoming.is_a?(Array)
        obj, options = incoming
      elsif incoming.is_a?(Hash)
        obj = @clazz.new(model_params)
        options = incoming
      else
        obj = incoming
      end
    else
      obj = @clazz.new(model_params)
    end

    if obj.save
      # Store in instance variable for auditing
      @obj = obj

      # Reload with eager loads
      obj = @clazz.includes(eager_loaded_associations).find(obj.id) if eager_loaded_associations.present?
      @obj = obj

      # Trigger post-create actions (emails, jobs, etc.)
      after_create_action(obj) if respond_to?(:after_create_action, true)

      includes = serializer_includes_for_action(:create)
      options[:include] = includes if includes.present?

      render_success(data: obj, serializer_options: options, status: :created)
    else
      render_error(errors: obj.errors.full_messages, status: :unprocessable_entity)
    end
  rescue => e
    Rails.logger.error "Create failed: #{e.message}\n#{e.backtrace.join("\n")}"
    render_error(error: e.message, status: :internal_server_error)
  end

  def update
    obj = nil
    options = {}

    if block_given?
      incoming = yield
      if incoming.is_a?(Array)
        obj, options = incoming
      elsif incoming.is_a?(Hash)
        obj = set_object
        options = incoming
      else
        obj = incoming
      end
    else
      obj = set_object
    end

    if obj.update(model_params)
      # Reload with eager loads
      obj = @clazz.includes(eager_loaded_associations).find(obj.id) if eager_loaded_associations.present?
      @obj = obj

      # Trigger post-update actions
      after_update_action(obj) if respond_to?(:after_update_action, true)

      includes = serializer_includes_for_action(:update)
      options[:include] = includes if includes.present?

      render_success(data: obj, serializer_options: options)
    else
      render_error(errors: obj.errors.full_messages, status: :unprocessable_entity)
    end
  rescue => e
    Rails.logger.error "Update failed: #{e.message}\n#{e.backtrace.join("\n")}"
    render_error(error: e.message, status: :internal_server_error)
  end

  def destroy
    obj = @obj || set_object

    if obj.destroy
      render_success(data: { message: "#{@clazz.name} deleted successfully" }, status: :no_content)
    else
      render_error(errors: obj.errors.full_messages, status: :unprocessable_entity)
    end
  rescue => e
    render_error(error: e.message, status: :internal_server_error)
  end

  # ============== Private Helper Methods ==============

  private

  # Set model class based on controller name
  def set_clazz
    model_name = controller_name.classify
    controller_namespace = self.class.name.deconstantize

    @clazz = "#{controller_namespace}::#{model_name}".constantize
  rescue NameError
    @clazz = model_name.constantize
  end

  # Find object by ID with eager loading support
  def set_object
    @obj = if eager_loaded_associations.present?
      @clazz.includes(eager_loaded_associations).find(params[:id])
    else
      @clazz.find(params[:id])
    end
  rescue ActiveRecord::RecordNotFound
    render_error(error: "#{@clazz.name} not found", status: :not_found)
  end

  # Override in controllers to define what to eager load
  def eager_loaded_associations
    []
  end

  # Override in controllers to define allowed order columns
  def allowed_order_columns
    %w[id created_at updated_at name price]
  end

  # Override in controllers to define serializer includes
  def default_serializer_includes
    {}
  end

  def serializer_includes_for_action(action)
    includes = default_serializer_includes

    if includes.is_a?(Hash)
      includes[action] || includes[:default] || []
    else
      includes.present? ? includes : []
    end
  end

  # This method should be overridden by respective child controllers
  def model_params
  end
end
