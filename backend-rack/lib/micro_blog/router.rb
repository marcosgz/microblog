module MicroBlog
  class Router
    ROUTES = [
      # posts
      { http_method: 'GET',     path: %r{^/posts/(?<id>[\w-]+)}, endpoint: ->(_req, params) { Api::Posts.show(params) } },
      { http_method: 'PUT',     path: %r{^/posts/(?<id>[\w-]+)}, endpoint: ->(_req, params) { Api::Posts.update(params) }, data: true },
      { http_method: 'DELETE',  path: %r{^/posts/(?<id>[\w-]+)}, endpoint: ->(_req, params) { Api::Posts.remove(params) } },
      { http_method: 'POST',    path: %r{^/posts}, endpoint: ->(_req, params) { Api::Posts.create(params) }, data: true },
      { http_method: 'GET',     path: %r{^/posts}, endpoint: ->(_req, params) { Api::Posts.index(params) } },
      # debug
      { http_method: 'GET',     path: %r{^/debug}, endpoint: ->(req, params) { Api::Debug.root(req, params) } },
      { http_method: 'POST',    path: %r{^/debug}, endpoint: ->(req, params) { Api::Debug.root(req, params) }, data: true },
      { http_method: 'GET',     path: %r{^/error}, endpoint: ->(req, _params) { raise RuntimeError, 'Test internal server error' } },
    ].freeze

    def self.find_match(http_method, path)
      result = nil
      ROUTES.each do |route|
        next unless route[:http_method] == http_method
        path_match = route[:path].match(path)
        next unless path_match

        params = path_match.names.each_with_object({}) { |name, memo| memo[name] = path_match[name] }
        break result = route.dup.merge(params: params)
      end
      result
    end
  end
end
