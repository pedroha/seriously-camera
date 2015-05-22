Green screening with WebRTC
===========================

Real-time video processing using HTML5 <video> and <canvas>
-----------------------------------------------------------

[HTML5 <video>](http://slides.html5rocks.com/#video-audio) is the standard HTML5 tag for videos. The great majority of current web video is based on Flash players (but Flash is not supported on iphones and ipads). The Flash players use the <embed> tag instead.

[HTML <canvas>](http://slides.html5rocks.com/#canvas-2d) supports drawing operations in [2D](http://slides.html5rocks.com/#canvas-2d-example) and [3D/WebGL](http://slides.html5rocks.com/#canvas-3d)

Using HTML5 <video>, <canvas> and Javascript is possible to do real-time video processing.

* [HTML5 Tron video](http://www.barbafan.de/html5video?video=tron)
* [Old Spice](http://www.barbafan.de/html5video)
* [Ambilight](http://media.chikuyonok.ru/ambilight/)
* [Blow up](http://craftymind.com/factory/html5video/CanvasVideo.html)
* [Seriously](http://seriouslyjs.com/)

All the examples actually use 2 <canvas> elements: one for intermediate pixel processing and one for the final output. These are all pretty 'dated' examples and came before requestAnimationFrame came out. They are all based on setTimeout() to every 33 milliseconds to achieve 30 frames per second. It would be make more sense to use requestAnimationFrame() nowadays or [Paul Irish's shim](http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/)

Ambilight was inspired by [Philips's ambilight player](http://www.ambilightplayer.philips.com/). Chikuyonok has a [blog post in Russian](http://chikuyonok.ru/2010/03/ambilight-video/)

Craftymind has a [blog post]((http://www.craftymind.com/blowing-up-html5-video-and-mapping-it-into-3d-space/)) describing the Blow Up.

All the examples are using canvas 2D with the exception of Seriously, which is using the WebGL context from the <canvas> element to use WebGL shaders for the many different effects. Seriously is based on real-time green screening and using many different filters with a different image background.


Media Capture API for WebRTC
============================

```

HTML5 Blowing Up
----------------
http://www.craftymind.com/blowing-up-html5-video-and-mapping-it-into-3d-space/
http://craftymind.com/factory/html5video/CanvasVideo.html

```
```

Seriously.js (Green screening!?)
------------

http://seriouslyjs.com/

```
```

WebRTC Mozilla
--------------
https://developer.mozilla.org/en-US/docs/Web/Guide/API/WebRTC

https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos



Taking Still Photos with WebRTC
-------------------------------
[WebRTC](https://developer.mozilla.org/en-US/docs/Web/Guide/API/WebRTC
) is a

http://mdn-samples.mozilla.org/s/webrtc-capturestill/
[source jsfiddle] (http://jsfiddle.net/ggmc9xz7/)
[refactored jsfiddle] (http://jsfiddle.net/sztbLqsz/)


How to setup Green Screening on the cheap
-----------------------------------------

These are some great short informational videos to get green screening on the cheap (or go for the more professional approach at a reasonable price)

[How to make green screen on the cheap](https://www.youtube.com/watch?v=h8fE_1SpEWY)
<iframe width="420" height="315" src="https://www.youtube.com/embed/h8fE_1SpEWY" frameborder="0" allowfullscreen></iframe>

[How to Make Green Screen Video](https://www.youtube.com/watch?v=Nvq6KoMCUo8)
<iframe width="560" height="315" src="https://www.youtube.com/embed/Nvq6KoMCUo8" frameborder="0" allowfullscreen></iframe>

[Green Screen Basics](https://www.youtube.com/watch?v=oxjlKc8ms1c)
<iframe width="560" height="315" src="https://www.youtube.com/embed/oxjlKc8ms1c" frameborder="0" allowfullscreen></iframe>

In the past, I had tried with flat green paper and it worked very well; thought I didn't cover all the background for a realistic compositing. This time, I wanted to try a little more professional setup. So I ordered by Amazon:

* $20 [Prism Backdrops 6x10' Chromakey Green Muslin Photo Video Backdrop Background](http://www.amazon.com/gp/product/B004EKAJ1M)

* $40 [StudioPRO SPK10-051 Product Photography Table Top Photo Studio Lighting Kit (Black)](http://www.amazon.com/gp/product/B00L5TGT82)




Hollywoods History of Faking It | Evolution of Greensock Compositing
--------------------------------------------------------------------

<iframe src="https://player.vimeo.com/video/70304814" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> <p><a href="https://vimeo.com/70304814">Hollywood&#039;s History of Faking It | The Evolution of Greenscreen Compositing</a> from <a href="https://vimeo.com/filmmakeriq">FilmmakerIQ.com</a> on <a href="https://vimeo.com">Vimeo</a>.</p>

References:
* https://vimeo.com/70304814
* https://www.youtube.com/watch?v=H8aoUXjSfsI
* https://vimeo.com/filmmakeriq
* http://filmmakeriq.com/



Tron: initCamera('barbapapa')
Ambilight: initCamera('example');
Blow up: initCamera('sourcevid');
Seriously: initCamera('video');