require 'rubygems'
require 'bundler/setup'

$: << File.join(File.dirname(__FILE__), 'lib')

require 'micro_blog'

MicroBlog.bootstrap!

def wrap_length(code, headers, content)
  headers['Content-Length'] = content.string.bytesize
  [code, headers, content]
end

run(->(env) {
  request = Rack::Request.new(env)

  verb = request.request_method.to_s
  path = request.path.to_s

  if verb == 'OPTIONS'
    headers = {
      'Vary' => 'Origin, Access-Control-Request-Headers',
      'Accept' => 'application/json',
      'Access-Control-Allow-Credentials' => 'true',
      'Access-Control-Allow-Methods' => 'GET,HEAD,PUT,PATCH,POST,DELETE',
      'Access-Control-Allow-Headers' => 'X-PINGOTHER, Content-Type',
      'Access-Control-Allow-Origin' => '*',
      'Content-Length' => '0',
    }
    [204, MicroBlog::HEADERS.merge(headers), StringIO.new('')]
  elsif route = MicroBlog::Router.find_match(verb, path)
    begin
      params = route[:params]
      if route[:data] && (content = request.body.read)
        params.merge! (JSON.parse(content) rescue {})
      end

      wrap_length(*route[:endpoint].(request, params))
    rescue => err
      wrap_length(500, MicroBlog::HEADERS, MicroBlog::Serializer.('error' => err.message))
    end
  else
    wrap_length(404, MicroBlog::HEADERS, MicroBlog::Serializer.('error' => 'not found'))
  end
})
