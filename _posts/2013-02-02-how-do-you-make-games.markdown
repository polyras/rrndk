---
layout: post
title: "How do you make games?"
date: 2013-02-02 15:01:51
---
Due to my work with [Virtual Manager](http://www.virtualmanager.com), I've been getting this question a lot: How do you make games?

I love helping people get into game making because game making is awesome. But usually I cannot justify spending several hours preparing and writing a great answer each time I'm asked. So people usually get a shorter and less thought out reply. This gives me a guilty conscience. They deserve better!

But I don't think "How do you make games?" is the right question. It wouldn't make sense to call Porsche and ask them "How do I make a car?" The question is too big for them to answer in a meaningful way. The same goes for game development. "How do I get started making games?" is a much better question because the corresponding answer is much more applicable.

Even with this refinement of the question, there are still billions of ways to answer it. I've thought about it, and this blog post is my answer to you, dear aspiring game developer who've no or little software experience. My goal will be to ignite your curiosity and outline the next few steps of your journey towards becoming a great game developer. I'll be assuming no prior experience with software and/or game development what so ever.

What is game development?
-----------------------

I believe game making is art on par with music, movies, painting, etc. It's about enjoying the process of creating enjoyable experiences for other people. And as with most arts, game development is a huge topic and can take a life time to fully master. But still, I believe everybody can do it. It's a matter of getting started and staying focused over time.

So what is game development in the first place? You could say it's a bucket of various unrelated skills: animation, anthropology, architecture, brainstorming, business, cinematography, communication, writing, economics, engineering, management, mathematics, music, programming, psychology, sound design, story telling, visual arts, etc. This sounds incredibly overwhelming. But don't fret - we just need to narrow our focus.

Programming is key
-----------------

In game development, I believe the most crucial of the aforementioned skills is *programming*.

If you can program, you can make games. Your first ones might be dumb, ugly and boring - but they are games. The same cannot be said for any of the other skills. A visual artist may be ever so talented - but if he cannot program, he cannot make a game.

And since our primary concern should be to get started, programming is the obvious place to start. Getting started means experimenting. It gets your head going. What would happen if I change this variable? What if you controlled the villain instead of the hero? How would my game feel, if I reversed gravity or made the protagonist a big red bouncy rubber ball? Experimentation is what fuels passion which is required to continue your journey.

Now, I'm not saying all game developers should be great programmers. I'm just saying it's a great way to get started. Even if you want to be an animator or writer.

Programming languages
---------------------

Trying to learn to program can be an overwhelming task. There are so many ways to do it, it's hard to know where to look. To make it easier for yourself, you should narrow the focus by choosing a programming language.

So what is a programming language? When programming, you write code. The code is run by the computer which in turn shows your game on screen. Code is written in a certain programming language. A programming language is like English, German and Danish, expect they are designed to be understood by both man and computer.

There are no such thing as "the best programming language". It all depends on what you want to build. Here's a list of pros and cons for some of the most popular programming languages.

* Javascript (not to be confused with Java) is the only language that runs without plugins (such as Java, Flash, etc.) in the browser. Due to recent browser developments Javascript has become fast enough to become viable for games (you can even make [3d games](https://developer.mozilla.org/en-US/demos/detail/bananabread)). The language is simple and its easy to get started as you don't need a lot of tools. On the downside, its hard to monetize Javascript games and making sure you game works in all different browsers can sometimes be a pain. Generally speaking, Javascript applications must be run inside a browser.
* Java is fast and have been widely popular for more than a decade. It can be hard to learn, especially if haven't done any [OOP](http://en.wikipedia.org/wiki/Object-oriented_programming)  before. Its pretty well supported on Windows, Mac OS, Linux and Android. [Minecraft](http://minecraft.net) was made with Java. It can be cumbersome to get started because you need a lot of tools.
* C# is like Java. Originally, it ran only on Windows. But thanks to the [Mono Project](http://www.mono-project.com/) it now runs pretty much every. Like Java, it can be difficult to learn for beginners. Personally, I like it over Java - it feels more modern and coherent. The downside is that you're dependent on the Mono Project. If that, for some reasons, fails, your code might no longer run on modern non-Windows platforms. As with Java, you need a lot of tools to get started.
* C++ is a so called "low level language": There's not much between your code and the actual computer. That means you'll have to understand a lot about how computers work before you can even start. You must explain everything very explicitly to the computer so you usually end up with very verbose code. Also, C++ code must be compiled to run which can sometimes feel like an annoying extra step. It's very hard to learn (compared to say, Javascript). On the upside it is incredibly fast. Modern "triple A games" with very detailed graphics such as Farcry and FIFA is written in C++.
* Ruby is a very beautiful, dynamic and simple language. I'd say it is almost as easy as Javascript. As with Javascript, it is rather easy to get going (especially if you're on Mac OS or Linux). You only need a simple text editor. The downside of Ruby is that it is not as fast as the other languages (nor was it intended to be). So you cannot write "realtime games" with live animations and such in Ruby - they'd be too slow. The reason I included it in this list, is that it works exceptionally well for asynchronous web games. We used Ruby (along with its web framework [Ruby on Rails](http://rubyonrails.org/)) to make [Virtual Manager](http://www.virtualmanager.com) and [Takeoff](http://takeoffgame.com). If you choose this language, be sure to learn at least a little Ruby before digging into Rails. If you like Ruby, you should also checkout Python which is similar.

There are a lot more languages but I hope you now have a at least slight idea what to look for. If you feel completely lost and don't know which one to choose, I'd recommend Javascript. It is simple, beginner-friendly and its easy to get going. [Mozilla's Learn Javascript](https://developer.mozilla.org/en-US/learn/javascript) is a good place to start. The most important part is that you select a language so you can start learning to program and start experimenting. And of course, you can always try another language later.

Learning the basics
----------------

When you've chosen a language you need to learn the basics of that language. You could try googling "[introduction to [language]](https://www.google.dk/search?q=introduction+to+javascript)" and checkout the first 5-20 articles that pop up. You'll probably find at least a few free quality articles. If an article is confusing, just skip to the next one.

Online tutorials are fine. But if you really want to get anywhere I recommend you supplement with a book or two. Books are typically (but indeed not always) better structured and edited. [Amazon.co.uk](http://amazon.co.uk) is great place to start searching. You could search for "[[language] beginner](http://www.amazon.co.uk/s/field-keywords=javascript+beginner) ", "[[language] introduction](http://www.amazon.co.uk/s/field-keywords=javascript+introduction)" or something like that. I usually pay attention to the books' rating (how many stars it has gotten) and reviews. It's a good indicator of the the quality.

I've heard people say they don't like books because, contrary to web pages, they are not free. I hate that argument. If you don't want to spend $40-60 on something that might change your life forever you should just quit already. You don't want it bad enough.

And I have to warn you. Getting started with programming can be tough. It might not be fun all the time. But just hang in there. Don't give up! More fun challenges are always waiting just around the corner.

Move on to games
---------------

When you feel you've got a basic understanding of your chosen language, you should start googling for something like "[how to make games with [language]](https://www.google.dk/search?q=how+to+make+games+with+javascript)". There should be a lot of delicious articles to get you going. And again, checkout Amazon. Perhaps you could search for "[[language] games](http://www.amazon.co.uk/s/field-keywords=javascript+games)".

The information is all around - it can't wait to make you smarter! You just have to let it in.

The next steps
------------

I hope you by now are beginning to see the next few steps of your path towards becoming a game developer. Of course, you can't assess the entire path of your journey. But don't worry - you only need to know where the next few steps are in order to continue.

I'll leave you with this advice: Remember to start small. Don't try to build the neext Minecraft as your first game. It won't happen and you'd probably burn out trying. Instead of creating an entire car, you should start by making a steering wheel. Then seats, the roof and so on. Eventually, you'll be able to build a car. You have to start small to make it big.

And in ten years when you release your first masterpiece, please let me know. I can't wait to play your game! :)
