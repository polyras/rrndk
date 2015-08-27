---
layout: post
title: "Ruby's ERB templating system - how does it work?"
date: 2009-08-31 10:13:00
---
All Rails developers have used the ERB templating system. That is what enables us to mix html and ruby in our view files. But how does it actually work? I found out today, and thought I'd share my findings.

ERB is a simple but powerful templating system entirely written in Ruby. The ERB class takes a templating string and some configuration options. Here's an example:

    require 'erb'
    name = "Rasmus"
    template_string = "My name is <%= name %>"
    template = ERB.new template_string
    puts template.result # prints "My name is Rasmus"

Upon object instantiation ERB looks through each line of the templating string for specific patterns. The most important patterns are:

* <% "ERB will evaluate this!" %>
* <%= "ERB will evaluate and output this!" %>

When the <code>result</code> method is called on the ERB object (last line in the above piece of code), all lines containing any of the specific patterns gets evaluated with a given _binding_. The binding is a pointer to a set of local variables. If no binding is given, the top level binding will be used, which is why <code><%= name %></code> gets evaluated as "Rasmus" in the above example.

Have you ever wondered how controller instance variables in Rails magically become available in your views? That is done by giving ERB the binding of the controller object. Here is a simple example that shows you how this is done:

    require 'erb'
    class DummyController
      def index
        @name = 'Rasmus'
      end
      def get_binding # this is only a helper method to access the objects binding method
        binding
      end
    end

    controller = DummyController.new
    controller.index
    template_string = "Welcome <%= @name %>" # this string would typically be read from a template file
    template = ERB.new template_string
    puts template.result(controller.get_binding) # prints "Welcome Rasmus"

If you want to know more, consider reading [the ERB docs](http://www.ruby-doc.org/stdlib/libdoc/erb/rdoc/classes/ERB.html). You also might want to look at another templating system called [HAML](http://haml-lang.com/), which besides evaluating Ruby in template files also helps you generate markup.
