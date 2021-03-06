"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuid = exports.title = exports.delay = exports.timer = exports.t2vb = exports.style = exports.reset = exports.Renderer = exports.rand = exports.prompt = exports.play = exports.overlap = exports.modifier = exports.meta = exports.material = exports.local = exports.line = exports.holds = exports.force = exports.fill = exports.ench = exports.crit = exports.color = exports.clone = exports.clamp = exports.remap = void 0;
const stdlib_paper_1 = require("@grakkit/stdlib-paper");
const mantle = require("@brayjamin/mantle");
const Material = (0, stdlib_paper_1.type)('org.bukkit.Material');
const Float = (0, stdlib_paper_1.type)('java.lang.Float');
const Enchantment = (0, stdlib_paper_1.type)('org.bukkit.enchantments.Enchantment');
const PotionEffectType = (0, stdlib_paper_1.type)('org.bukkit.potion.PotionEffectType');
const NamespacedKey = (0, stdlib_paper_1.type)('org.bukkit.NamespacedKey');
const Vector = (0, stdlib_paper_1.type)('java.util.Vector');
const Double = (0, stdlib_paper_1.type)('java.lang.Double');
const UUID = (0, stdlib_paper_1.type)('java.util.UUID');
const AttributeModifier = (0, stdlib_paper_1.type)('org.bukkit.attribute.AttributeModifier');
const Operation = (0, stdlib_paper_1.type)('org.bukkit.attribute.AttributeModifier.Operation');
const EquipmentSlot = (0, stdlib_paper_1.type)('org.bukkit.inventory.EquipmentSlot');
const BoundingBox = (0, stdlib_paper_1.type)('org.bukkit.util.BoundingBox');
const DustOptions = (0, stdlib_paper_1.type)('org.bukkit.Particle.DustOptions');
const Color = (0, stdlib_paper_1.type)('org.bukkit.Color');
const Particle = (0, stdlib_paper_1.type)('org.bukkit.Particle');
const Statistic = (0, stdlib_paper_1.type)('org.bukkit.Statistic');
const EntityType = (0, stdlib_paper_1.type)('org.bukkit.entity.EntityType');
const Type = (0, stdlib_paper_1.type)('org.bukkit.Statistic.Type');
function remap(object, consumer) {
    object instanceof Array || (object = Object.entries(object));
    return Object.fromEntries(object.map(consumer).filter(value => value));
}
exports.remap = remap;
function clamp(number, min, max) {
    return number < min ? min : number > max ? max : number;
}
exports.clamp = clamp;
function clone(object) {
    return JSON.parse(JSON.stringify(core.simplify(object)));
}
exports.clone = clone;
function color(text) {
    return text.toString().split('&').join('\xA7').split('\xA7\xA7').join('&');
}
exports.color = color;
function crit(player) {
    return (player.getFallDistance() > 0 &&
        !player.isInWater() &&
        !player.isOnGround() &&
        !player.isSprinting() &&
        !player.isInsideVehicle() &&
        //@ts-expect-error
        !player.hasPotionEffect(PotionEffectType.BLINDNESS) &&
        ![Material.LADDER, Material.VINE].includes(player.getLocation().getBlock().getType()));
}
exports.crit = crit;
function ench(name) {
    return Enchantment.getByKey(NamespacedKey.minecraft(name));
}
exports.ench = ench;
function fill(object, defaults) {
    for (const key in defaults)
        object[key] === undefined && (object[key] = clone(defaults[key]));
    return object;
}
exports.fill = fill;
function force(target, x, y, z, relative) {
    target.setVelocity(local(target.getVelocity(), relative ? target.getLocation() : target.getLocation().toVector().toLocation(target.getWorld()), x, y, z));
}
exports.force = force;
function holds(player, condition) {
    const equipment = player.getEquipment();
    return condition(equipment.getItemInMainHand()) || condition(equipment.getItemInOffHand());
}
exports.holds = holds;
function line(base, input) {
    for (const key in input || {})
        base = base.split(`{${key}}`).join(input[key]);
    return base;
}
exports.line = line;
function local(target, source, x, y, z) {
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
exports.local = local;
exports.material = remap([...Material.values()], material => {
    if (!material.isLegacy())
        return [material.getKey().getKey(), material];
});
const meta = (item, modifier) => {
    const meta = item.getItemMeta();
    if (meta) {
        const result = modifier(meta);
        item.setItemMeta(meta);
        return result;
    }
};
exports.meta = meta;
function modifier(amount, operation, slot, uuid) {
    return new AttributeModifier(uuid || UUID.randomUUID(), '', amount, Operation[operation], slot ? EquipmentSlot[slot] : slot);
}
exports.modifier = modifier;
function overlap(bounds, subject) {
    subject instanceof BoundingBox || (subject = subject.getBoundingBox());
    return bounds.contains(subject) || bounds.overlaps(subject);
}
exports.overlap = overlap;
function play(player, options) {
    player.playSound(player.getLocation(), options.sound, 
    //@ts-expect-error
    new Float(options.volume || 1), new Float(options.pitch || 1));
}
exports.play = play;
exports.prompt = (() => {
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
exports.rand = {
    range: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    threshold: max => {
        return Math.random() < max;
    }
};
const Renderer = class {
    constructor() {
        //@ts-expect-error
        this.max = {};
        //@ts-expect-error
        this.axes = {};
        //@ts-expect-error
        this.state = {};
    }
    get bounds() {
        //@ts-expect-error
        return this.state.bounds;
    }
    set bounds(value) {
        const { max, min } = mantle.serialize(value);
        //@ts-expect-error
        this.axes = {
            x: [[min.x, min.y, min.z], [min.x, min.y, max.z], [min.x, max.y, min.z], [min.x, max.y, max.z]],
            y: [[min.x, min.y, min.z], [min.x, min.y, max.z], [max.x, min.y, min.z], [max.x, min.y, max.z]],
            z: [[min.x, min.y, min.z], [min.x, max.y, min.z], [max.x, min.y, min.z], [max.x, max.y, min.z]]
        };
        //@ts-expect-error
        this.max = max;
        //@ts-expect-error
        this.state.bounds = value;
    }
    tick(style, quality, ...targets) {
        const particle = new DustOptions(Color.fromRGB(style.color), style.size);
        //@ts-expect-error
        for (const [axis, values] of Object.entries(this.axes)) {
            //@ts-expect-error
            for (let [...ray] of values) {
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
exports.Renderer = Renderer;
exports.reset = {
    stats(player) {
        for (const stat of [...Statistic.values()]) {
            switch (stat.getType()) {
                case Type.BLOCK:
                    for (const material of [...Material.values()]) {
                        if (material.isBlock()) {
                            try {
                                player.setStatistic(stat, material, 0);
                            }
                            catch (error) { }
                        }
                    }
                    break;
                case Type.ENTITY:
                    for (const lifeform of [...EntityType.values()]) {
                        try {
                            player.setStatistic(stat, lifeform, 0);
                        }
                        catch (error) { }
                    }
                    break;
                case Type.ITEM:
                    for (const material of [...Material.values()]) {
                        if (material.isItem()) {
                            try {
                                player.setStatistic(stat, material, 0);
                            }
                            catch (error) { }
                        }
                    }
                    break;
                default:
                    try {
                        player.setStatistic(stat, 0);
                    }
                    catch (error) { }
                    break;
            }
        }
    }
};
exports.style = {
    article(text) {
        return `${['a', 'e', 'i', 'o', 'u'].includes(text[0]) ? 'an' : 'a'} ${text}`;
    },
    camel(element, index) {
        return index ? exports.style.pascal(element) : element;
    },
    justify: (string, limit, prefix) => {
        const output = [''];
        let index = 0;
        let current = 0;
        string.split('\n').forEach(line => {
            line.split(' ').forEach(word => {
                const size = word.replace(/(??.)/g, '').length;
                if (size > limit) {
                    current > 0 && ++index;
                    output[index] = word;
                    current = 0;
                    ++index;
                    output[index] = '';
                }
                else {
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
    pascal(element) {
        return element[0].toUpperCase() + element.slice(1);
    }
};
function t2vb(ticks) {
    let tick = 0;
    let velocity = 0;
    let blocks = 0;
    while (tick++ < ticks) {
        velocity = (velocity - 0.08) * 0.98;
        blocks -= velocity;
    }
    return [velocity, blocks];
}
exports.t2vb = t2vb;
exports.timer = (() => {
    const timers = new Map();
    return (key, time, script) => {
        timers.has(key) && clearTimeout(timers.get(key));
        time && timers.set(key, setTimeout(() => (script(), timers.delete(key)), time));
    };
})();
exports.delay = (() => {
    return (start, end, timeout) => {
        (0, exports.timer)('this/delay/start', timeout, start);
        setImmediate(end);
    };
})();
function title(instance, text) {
    instance.sendTitle(...`${text}\n`.split('\n').slice(0, 2), 10, 70, 20);
}
exports.title = title;
function uuid(entity) {
    return entity.getUniqueId().toString();
}
exports.uuid = uuid;
