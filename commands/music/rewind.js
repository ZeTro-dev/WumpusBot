

const utils = require('../../utils.js');

module.exports = {
	name: 'rewind',
	aliases: ['rw'],
	description: 'Rembobinez la musique.',
	privateMessage: false,
	message: (message, object) => {
		if (!(message.client.music && message.client.music[message.guild.id])) {
			utils.sendMessage(message.channel, object.dictionary, 'error_rewind_no_data');
			return;
		}
		if (!(message.guild.me.voice.channelID
			&& message.member.voice.channelID == message.guild.me.voice.channelID)) {
			utils.sendMessage(message.channel, object.dictionary, 'error_rewind_not_same_voice');
			return;
		}
		if (!object.args.length) {
			utils.sendMessage(message.channel, object.dictionary, 'error_invalid_format', {
				format: `${object.prefix}rewind <seconds>`
			});
			return;
		}
		if (isNaN(object.args[0])) {
			utils.sendMessage(message.channel, object.dictionary, 'error_isnana', {
				'arg': object.args[0]
			});
			return;
		}
		const number = parseInt(object.args[0])
		if (number <= 0) {
			utils.sendMessage(message.channel, object.dictionary, 'error_rewind_number_too_small');
			return;
		}
		const current = message.client.music[message.guild.id].current;
		let time = (current.time ? current.time : 0) + message.client.music[message.guild.id].connection.dispatcher.streamTime;
		if (time < number * 1000)
			time = 0;
		else
			time -= number * 1000
		current.time = time;
		let start;
		if (message.client._commands.music)
			start = message.client._commands.music.find(item => item.start).start;
		if (!start) {
			utils.sendMessage(message.channel, dictionary, 'error_rewind_no_start');
			return;
		}
		start(message.client, message.guild.id, current);
		time -= time % 1000;
		time /= 1000;
		let seconde = time % 60;
		const minute = (time - seconde) / 60;
		if (seconde < 10)
			seconde = `0${seconde}`;
		utils.sendMessage(message.channel, object.dictionary, 'rewind_success', {
			time: `${minute}:${seconde}`
		});
	}
};