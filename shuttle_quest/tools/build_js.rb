filePaths = [
  'javascript/lib/number_ext.js',
  'javascript/lib/voy/voy.js',
  'javascript/lib/voy/voy/game.js',
  'javascript/lib/voy/voy/vector2.js',
  'javascript/lib/voy/voy/matrix2.js',
  'javascript/lib/voy/voy/event_emitter.js',
  'javascript/lib/voy/voy/component.js',
  'javascript/lib/voy/voy/component_feeder.js',
  'javascript/lib/voy/voy/entity_container.js',
  'javascript/lib/voy/voy/entity.js',
  'javascript/lib/voy/voy/geometry/shape.js',
  'javascript/lib/voy/voy/geometry/polygonic.js',
  'javascript/lib/voy/voy/geometry/rectangle.js',
  'javascript/lib/voy/voy/geometry/polygon.js',
  'javascript/lib/voy/voy/geometry/circle.js',
  'javascript/lib/voy/voy/geometry/projection.js',
  'javascript/lib/voy/voy/geometry/line_segment.js',
  'javascript/lib/voy/voy/geometry/point.js',
  'javascript/lib/voy/voy/physics/physics_engine.js',
  'javascript/lib/voy/voy/physics/collider.js',
  'javascript/lib/voy/voy/physics/collision_detector.js',
  'javascript/lib/voy/voy/physics/collision.js',
  'javascript/lib/voy/voy/physics/rectangle_collider.js',
  'javascript/lib/voy/voy/physics/polygon_collider.js',
  'javascript/lib/voy/voy/physics/circle_collider.js',
  'javascript/lib/voy/voy/physics/rigid_body.js',
  'javascript/lib/voy/voy/assets/asset_manager.js',
  'javascript/lib/voy/voy/assets/sound.js',
  'javascript/lib/voy/voy/assets/loader.js',
  'javascript/lib/voy/voy/assets/image_loader.js',
  'javascript/lib/voy/voy/assets/text_loader.js',
  'javascript/lib/voy/voy/assets/sound_loader.js',
  'javascript/lib/voy/voy/component_registry.js',
  'javascript/lib/voy/voy/rendering/canvas.js',
  'javascript/lib/voy/voy/rendering/renderer.js',
  'javascript/lib/voy/voy/rendering/layer.js',
  'javascript/lib/voy/voy/rendering/circle_layer.js',
  'javascript/lib/voy/voy/rendering/polygon_layer.js',
  'javascript/lib/voy/voy/rendering/sprite.js',
  'javascript/lib/voy/voy/rendering/rectangle_layer.js',
  'javascript/lib/voy/voy/rendering/text_canvas.js',
  'javascript/lib/voy/voy/scene.js',
  'javascript/lib/voy/voy/keyboard.js',
  'javascript/lib/voy/voy/mouse.js',
  'javascript/game.js',
  'javascript/entity_factory.js',
  'javascript/player_input.js',
  'javascript/camera.js',
  'javascript/polygon_type_registry.js',
  'javascript/world_scene.js',
  'javascript/engine_rotator.js',
  'javascript/fader.js',
  'javascript/ready_fader.js',
  'javascript/health.js',
  'javascript/collision_damage_inflictor.js',
  'javascript/fading_background_layer.js',
  'javascript/thrust.js',
  'javascript/tidal_force.js',
  'javascript/water_layer.js',
  'javascript/water_resistance.js',
  'javascript/health_circle_layer.js',
  'javascript/level_progress_layer.js',
  'javascript/time_bonus_layer.js',
  'javascript/time_status_layer.js',
  'javascript/level_completed_layer.js',
  'javascript/time_adder.js',
  'javascript/rotation.js',
  'javascript/collision_win.js',
  'javascript/gravity.js',
  'javascript/credits_scene.js',
  'javascript/credits_layer.js',
  'javascript/ready_text_layer.js',
  'javascript/decided_fader.js',
  'javascript/timer.js',
  'javascript/level_completed_scene.js',
  'javascript/timer_layer.js',
  'javascript/level_registry.js',
  'javascript/flame_flicker.js',
  'javascript/loading_scene.js',
  'javascript/spaceship_sprite.js',
  'javascript/spaceship_flame_sprite.js',
  'javascript/initializer.js',
]

fileSources = []

filePaths.each do |filePath|
  fullFilePath = File.join File.dirname(__FILE__), '..', filePath
  file = File.new(fullFilePath, 'r')
  contents = file.read
  fileSources << contents
  file.close
end

source = fileSources.join("\n\n")

file = File.new('snitch.js', 'w')
file.write(source)
file.close

puts "done!"
