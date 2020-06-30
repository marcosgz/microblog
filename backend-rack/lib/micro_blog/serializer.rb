
require 'json'

module MicroBlog
  class Serializer
    def self.call(value)
      StringIO.new value.is_a?(Hash) || value.is_a?(Array) ? JSON.dump(value) : ''
    end
  end
end
