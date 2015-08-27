---
layout: post
title: "Fighting broken windows"
date: 2009-07-21 12:34:00
---
In the book "The Pragmatic Programmer" Andy Hunt and Dave Thomas applies [The Broken Window Theory](http://www.codinghorror.com/blog/files/Atlantic%20Monthly%20-%20Broken%20Windows.htm) to software development. The idea is that your code base has a much higher probability of [rotting](http://en.wikipedia.org/wiki/Software_rot), if you do not fix all "broken windows" (poor code, bad design) as fast as possible. The Pragmatic Programmer suggests you should fix broken windows immediately after discovering them. This is hard to do without suddenly having too many balls in the air. In this article I will share a very simple, yet extremely useful idea on how to fight broken windows easier.

If you have not read about broken windows in software, you might want to [read this](http://www.pragprog.com/the-pragmatic-programmer/extracts/software-entropy) before moving on.

I'm currently working on a new online game project (which by the way is still very very secret, [follow me on twitter for updates](http://twitter.com/rasmusrn)). It has been very long time since I last had the pleasure of starting from scratch on a new project so I really enjoy not constantly facing cumbersome legacy code. After reading The Programatic Programmer (which, by the way, is a must-read even though it was published more than 10 years ago) I've continuously focused a lot on discovering broken windows while coding to keep my code and designs as good as possible. In this process I found that broken windows are most often discovered while fixing bugs or implementing a new features. Following the guidelines from the Pragmatic Programmers, you should fix the newly discovered broken window immediately. Depending on the complexity of what you are doing while discovering the broken window, this can be very expensive in terms of context switching. Throwing more balls in the air while already dealing with a complex task by analyzing and fixing the broken window immediately, reduces your overview, thus reducing the overall quality of the code you write.

A quick note
----------

Instead of fixing the broken window immediately, I've found that it is almost always much more favorable in terms of code quality and development time to write down a short note describing the problem with the broken window. The quality or length of the description does not matter. It is not the analysis or solution of the broken window that is important; what is important is that it is there and needs a fix. Then some time later when you are not busy with any certain tasks, you can look at your notes, and take your time to analyze and repair the broken window.

Advantages
----------

By using this simple technique you gain great advantages:

* By having an super easy way of recording the existence of a broken window the probability of it being recorded is much higher. More broken windows recorded, more fixed, better code.
* You minimize your mental context switching thus optimizing the design and code you were working on while discovering the broken window.
* You give yourself the possibility to devote yourself 100% when analyzing and repairing a broken window.
* By repairing broken windows efficiently, your love for your code base will increase making you more creative, passionate, and productive.

My experiences
-------------

In my new game project, my list of broken windows often adds up to 10-15 before I start repairing them. Call me an über geek if you will, but it just feels so pleasant when you feel you've just improved the overall quality of your code base! The higher code quality, the more I love working with it, and the more creative, passionate, and productive I become! And guess what, this just yields better products.
