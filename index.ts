import { type } from '@grakkit/stdlib-paper';
import { obeEntity, obePlayer } from '@grakkit/types-paper';
import * as mantle from '@brayjamin/mantle';
import * as types from '@grakkit/types-paper';

const Material = type('org.bukkit.Material');
const Float = type('java.lang.Float');
const Enchantment = type('org.bukkit.enchantments.Enchantment');
const PotionEffectType = type('org.bukkit.potion.PotionEffectType');
const NamespacedKey = type('org.bukkit.NamespacedKey');
const Vector = type('java.util.Vector');
const Double = type('java.lang.Double');
const UUID = type('java.util.UUID');
const AttributeModifier = type('org.bukkit.attribute.AttributeModifier');
const Operation = type('org.bukkit.attribute.AttributeModifier.Operation');
const EquipmentSlot = type('org.bukkit.inventory.EquipmentSlot');
const BoundingBox = type('org.bukkit.util.BoundingBox');
const DustOptions = type('org.bukkit.Particle.DustOptions');
const Color = type('org.bukkit.Color');
const Particle = type('org.bukkit.Particle');
const Statistic = type('org.bukkit.Statistic');
const EntityType = type('org.bukkit.entity.EntityType');
const Type = type('org.bukkit.Statistic.Type');

export function remap (object, consumer) {
   object instanceof Array || (object = Object.entries(object));
   return Object.fromEntries(object.map(consumer).filter(value => value));
}
export function clamp (number: number, min: number, max: number) {
   return number < min ? min : number > max ? max : number;
}
export function clone (object) {
   return JSON.parse(JSON.stringify(core.simplify(object)));
}
export function color (text: string) {
   return text.toString().split('&').join('\xA7').split('\xA7\xA7').join('&');
}
export function crit (player: obePlayer) {
   return (
      player.getFallDistance() > 0 &&
      !player.isInWater() &&
      !player.isOnGround() &&
      !player.isSprinting() &&
      !player.isInsideVehicle() &&
      //@ts-expect-error
      !player.hasPotionEffect(PotionEffectType.BLINDNESS) &&
      ![ Material.LADDER, Material.VINE ].includes(player.getLocation().getBlock().getType())
   );
}
export function ench (name: string) {
   return Enchantment.getByKey(NamespacedKey.minecraft(name));
}
export function fill (object, defaults) {
   for (const key in defaults) object[key] === undefined && (object[key] = clone(defaults[key]));
   return object;
}
export function force (target: obeEntity, x: number, y: number, z: number, relative) {
   target.setVelocity(
      local(
         target.getVelocity(),
         relative ? target.getLocation() : target.getLocation().toVector().toLocation(target.getWorld()),
         x,
         y,
         z
      )
   );
}
export function holds (player: obePlayer, condition) {
   const equipment = player.getEquipment();
   return condition(equipment.getItemInMainHand()) || condition(equipment.getItemInOffHand());
}
export function line (base, input) {
   for (const key in input || {}) base = base.split(`{${key}}`).join(input[key]);
   return base;
}
export function local (target, source, x: number, y: number, z: number) {
   //@ts-expect-error
   const local = new Vector(new Double(x), new Double(y), new Double(z));
   //@ts-expect-error
   local.rotateAroundX(source.getPitch() * Math.PI / 180);
   //@ts-expect-error
   local.rotateAroundY(source.getYaw() * Math.PI / 180 * -1);
   //@ts-expect-error
   target.setX(target.getX() + local.getX());
   //@ts-expect-error
   target.setY(target.getY() + local.getY());
   //@ts-expect-error
   target.setZ(target.getZ() + local.getZ());
   return target;
}
export const material = remap([ ...Material.values() ], material => {
   if (!material.isLegacy()) return [ material.getKey().getKey(), material ];
});
export const meta = (item: types.obiItemStack, modifier) => {
   const meta = item.getItemMeta();
   if (meta) {
      const result = modifier(meta);
      item.setItemMeta(meta);
      return result;
   }
};
export function modifier (amount: number, operation, slot, uuid) {
   return new AttributeModifier(
      uuid || UUID.randomUUID(),
      '',
      amount,
      Operation[operation],
      slot ? EquipmentSlot[slot] : slot
   );
}
export function overlap (bounds, subject) {
   subject instanceof BoundingBox || (subject = subject.getBoundingBox());
   return bounds.contains(subject) || bounds.overlaps(subject);
}
export function play (player: obePlayer, options) {
   player.playSound(
      player.getLocation(),
      options.sound,
      //@ts-expect-error
      new Float(options.volume || 1),
      new Float(options.pitch || 1)
   );
}
export const prompt = (() => {
   const prompts = new Map();
   core.event('org.bukkit.event.player.AsyncPlayerChatEvent', event => {
      //@ts-expect-error
      const uuid = uuid(event.getPlayer());
      if (prompts.has(uuid)) {
         event.setCancelled(true);
         const callback = prompts.get(uuid);
         prompts.delete(uuid);
         const message = event.getMessage();
         event.setMessage('');
         callback(message);
      }
   });
   core.event('org.bukkit.event.player.PlayerQuitEvent', event => {
      //@ts-expect-error
      const uuid = uuid(event.getPlayer());
      if (prompts.has(uuid)) {
         const callback = prompts.get(uuid);
         prompts.delete(uuid);
         callback(null);
      }
   });
   core.event('org.bukkit.event.player.PlayerToggleSneakEvent', event => {
      if (!event.isSneaking()) {
         //@ts-expect-error
         const uuid = uuid(event.getPlayer());
         if (prompts.has(uuid)) {
            const callback = prompts.get(uuid);
            prompts.delete(uuid);
            callback(null);
         }
      }
   });
   return (instance, message, callback) => {
      setTimeout(() => {
         instance.closeInventory();
         instance.sendMessage(message);
         prompts.set(uuid(instance), callback);
      });
   };
})();
export const rand = {
   range: (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
   },
   threshold: max => {
      return Math.random() < max;
   }
};
export const Renderer = class {
   constructor () {
      //@ts-expect-error
      this.max = {};
      //@ts-expect-error
      this.axes = {};
      //@ts-expect-error
      this.state = {};
   }
   get bounds () {
      //@ts-expect-error
      return this.state.bounds;
   }
   set bounds (value) {
      const { max, min } = mantle.serialize(value);
      //@ts-expect-error
      this.axes = {
         x: [ [ min.x, min.y, min.z ], [ min.x, min.y, max.z ], [ min.x, max.y, min.z ], [ min.x, max.y, max.z ] ],
         y: [ [ min.x, min.y, min.z ], [ min.x, min.y, max.z ], [ max.x, min.y, min.z ], [ max.x, min.y, max.z ] ],
         z: [ [ min.x, min.y, min.z ], [ min.x, max.y, min.z ], [ max.x, min.y, min.z ], [ max.x, max.y, min.z ] ]
      };
      //@ts-expect-error
      this.max = max;
      //@ts-expect-error
      this.state.bounds = value;
   }
   tick (style, quality, ...targets) {
      const particle = new DustOptions(Color.fromRGB(style.color), style.size);
      //@ts-expect-error
      for (const [ axis, values ] of Object.entries(this.axes)) {
         //@ts-expect-error
         for (let [ ...ray ] of values) {
            const value = { x: 0, y: 1, z: 2 }[axis];
            //@ts-expect-error
            while (ray[value] < this.max[axis]) {
               for (const target of targets) {
                  target.spawnParticle(Particle.REDSTONE, ray[0], ray[1], ray[2], 1, 0, 0, 0, 0, particle);
               }
               ray[value] += 1 / quality;
            }
         }
      }
   }
};
export const reset = {
   stats (player: obePlayer) {
      for (const stat of [ ...Statistic.values() ]) {
         switch (stat.getType()) {
            case Type.BLOCK:
               for (const material of [ ...Material.values() ]) {
                  if (material.isBlock()) {
                     try {
                        player.setStatistic(stat, material, 0);
                     } catch (error) {}
                  }
               }
               break;
            case Type.ENTITY:
               for (const lifeform of [ ...EntityType.values() ]) {
                  try {
                     player.setStatistic(stat, lifeform, 0);
                  } catch (error) {}
               }
               break;
            case Type.ITEM:
               for (const material of [ ...Material.values() ]) {
                  if (material.isItem()) {
                     try {
                        player.setStatistic(stat, material, 0);
                     } catch (error) {}
                  }
               }
               break;
            default:
               try {
                  player.setStatistic(stat, 0);
               } catch (error) {}
               break;
         }
      }
   }
};
export const style = {
   article (text: string) {
      return `${[ 'a', 'e', 'i', 'o', 'u' ].includes(text[0]) ? 'an' : 'a'} ${text}`;
   },
   camel (element: string, index) {
      return index ? style.pascal(element) : element;
   },
   justify: (string: string, limit: number, prefix: string) => {
      const output = [ '' ];
      let index = 0;
      let current = 0;
      string.split('\n').forEach(line => {
         line.split(' ').forEach(word => {
            const size = word.replace(/(§.)/g, '').length;
            if (size > limit) {
               current > 0 && ++index;
               output[index] = word;
               current = 0;
               ++index;
               output[index] = '';
            } else {
               current += size;
               if (current > limit) {
                  current = 0;
                  output[++index] = '';
               }
               output[index] += `${output[index] === '' ? '' : ' '}${word}`;
            }
         });
      });
      return prefix ? output.map(line => prefix + line) : output;
   },
   pascal (element: string) {
      return element[0].toUpperCase() + element.slice(1);
   }
};
export function t2vb (ticks: number) {
   let tick = 0;
   let velocity = 0;
   let blocks = 0;
   while (tick++ < ticks) {
      velocity = (velocity - 0.08) * 0.98;
      blocks -= velocity;
   }
   return [ velocity, blocks ];
}
export const timer = (() => {
   const timers = new Map();
   return (key, time, script) => {
      timers.has(key) && clearTimeout(timers.get(key));
      time && timers.set(key, setTimeout(() => (script(), timers.delete(key)), time));
   };
})();
export const delay = (() => {
   return (start, end, timeout) => {
      timer('this/delay/start', timeout, start);
      setImmediate(end);
   };
})();
export function title (instance, text: string) {
   instance.sendTitle(...`${text}\n`.split('\n').slice(0, 2), 10, 70, 20);
}
export function uuid (entity: obeEntity) {
   return entity.getUniqueId().toString();
}
