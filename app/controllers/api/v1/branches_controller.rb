class Api::V1::BranchesController < Api::V1::BaseController
  def index
    data = @clazz.active.ordered

    index do
      data
    end
  end

  private

  def model_params
    params.expect(branch: [ :name, :address, :phone, :active, :sort_order ]).permit!
  end
end
