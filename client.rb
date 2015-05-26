require 'rubygems'
require 'sinatra'
require 'json'

require "net/http"
require "uri"

post '/solve' do 

	request.body.rewind
  	@datos = JSON.parse request.body.read
  	puts @datos

end
