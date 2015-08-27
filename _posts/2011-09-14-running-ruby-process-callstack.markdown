---
layout: post
title: "Getting the callstack of a running Ruby process"
date: 2011-09-14 07:13:44
---
Since we upgraded to Rails 3.1 at [Virtual Manager](http://www.virtualmanager.com) we've seen our app servers' CPUs going into self-oscillation every two hours or so. And every time, it would be a Ruby process eating as much CPU power as it could.

If we did not manually kill these Ruby processes once in a while, the app server would eventually run of out CPU cores and become unavailable.

The problem was that I had no easy way of finding out what these Ruby process were doing. Our logs weren't telling us anything, presumably because the processes never really exited. I also tried adding [Rack::Timeout](https://github.com/kch/rack-timeout) to get our Rails app to throw an exception when requests took too long. No luck there.

What if I could somehow open up one of the strayed Ruby processes live while it was running, and look into its current callstack? Then I would be able to find out what was causing this.

Today, I did just that and located the culprit. I'd like to share how I did it.

I learned this technique from [this blog post](http://weblog.jamisbuck.org/2006/9/22/inspecting-a-live-ruby-process) by [Jamis Buck](http://twitter.com/jamis). However, his exact approach did not work for me. Perhaps because we're running Ruby 1.9.2. By combining what I learned from Jamis' blog post with what I learned by reading [this blog post](http://www.coffeepowered.net/2010/08/23/mongomapper-development-mode-and-memory-leaks/) by [Chris Heald](http://twitter.com/cheald) I came up with my own solution.

First I installed [GDB](http://www.gnu.org/s/gdb/): `apt-get install gdb`.

Then I created this file in `~/.gdbinit`:

    define eval
      call(rb_p(rb_eval_string_protect($arg0,(int*)0)))
    end
     
    define redirect_stdout
      call rb_eval_string("$_old_stdout, $stdout = $stdout, File.open('/tmp/ruby-debug.' + Process.pid.to_s, 'a'); $stdout.sync = true")
    end

All credits for this little snippet goes to [Chris Heald](http://twitter.com/cheald).

Next, I looked up the PID of the process I wanted to look into. I used `top` for this (PIDs are in the left most column per default I think). I then fired up GDB by running `gdb` and attached the process by typing `attach [PID]`.

In order to redirect output into a log file you must then type `redirect_stdout` (defined in our GDB init script). After this, all output will be sent to a file called `/tmp/ruby-debug.[PID]`.

Now, we can look into the Ruby process as we please. I called `eval("Kernel.caller")` to dump the entire callstack. I later found out, that you also have access to whatever variables are available in the current context - that means you can output arguments from the latest method call for instance. Pretty handy.

Bonus info
---------

The culprit to our CPU problem was that Rack 1.3.2 utilizes `URI.decode_www_form_component` defined in Ruby's own `uri/common.rb`. With Ruby 1.9.2-p290 and Ruby 1.9.2-p180 this method goes nuts if called with certain input. [It seems](http://stackoverflow.com/questions/6921398/thin-server-process-hanging-at-100-cpu-in-what-appears-to-be-a-regex-loop-where) we are not the only one who have suffered from this.

My solution was to redefine the problematic methods in a Rails initializer. I simply copied over parts of `uri/common.rb`.

I found [this related bug](http://redmine.ruby-lang.org/issues/5149) report in Ruby's issue tracker. The issue is already fixed in Ruby 1.9.3 and maybe backported to Ruby 1.9.2.
