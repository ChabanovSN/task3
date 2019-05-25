var counter = 0; // количнство угаданных пар
var start = false; // контроль начала игры и включение времени
var stop = false;// контроль окончание игры 
var yourResult; /// строка вывода результата
var counterClickStart = 0;

function beginGame() {

	$(document).ready(() => {

		//функция, которая перемешивает массив
		function mix(mixArray) {
			mixArray.sort(
				(a, b) => {
					return Math.random() - 0.5;
				}
			);
			return mixArray;
		}

		var last_color; //Последняя показанная картинка

		var click_flag = 1;
		var count_click = 0; //Кол-во кликов
		var game_array = [1, 3, 4, 5, 6, 1, 7, 8, 2, 6, 7, 3, 4, 5, 8, 2]; //Массив расположения картинок
		var colors = $.parseJSON('{ "1":"#d50000","2":"#aa00ff","3":"#304ffe",' + // JSON вместо массива  что бы не парсить строку в цифру 
			'"4":"#0091ea","5":"#2e7d32","6":"#ffd600","7":"#dd2c00","8":"#546e7a"}');

		mix(game_array); //перемешиваем массив (картинки)

		$('.igra_pamyat div').each(function () {
			$(this).attr({ 'class': '' + game_array[count_click], 'data-state': '0' });
			count_click++;
		});

		count_click = 0;

		$('.igra_pamyat div').click(function () { //Клик на игровом поле
			if (start) {
				if ($(this).data('state') == 0 && click_flag == 1) { //Если ячейка закрыта

					if (count_click == 0) { //Если первый клик по закрытому полю
						count_click++;
						last_color = $(this).attr('class');
						$(this).data('state', 1).attr('data-state', 1).css('background-color', `${colors[last_color]}`);
					} else {

						//Если картинки совпадают
						if (last_color == $(this).attr('class')) {
							$('.' + last_color).data('state', 2).attr('data-state', 2).css('background-color', `${colors[last_color]}`);
							++counter;

							if (counter == 8) {
								stop = true;
								setTimeout(stopGame, 1000);// отсрочка что бы клетка успела поменять цвет

							}

						} else {

							$(this).data('state', 1).attr('data-state', 1).css('background-color', `${colors[$(this).attr('class')]}`);

							click_flag = 0;

							function hide_img() { //Делаем задержку
								$('.igra_pamyat div').each(function () {
									if ($(this).data('state') == 1) {
										$(this).data('state', 0).attr('data-state', 0).css('background-color', 'white');
									}
								});
								click_flag = 1;
							}
							setTimeout(hide_img, 1000);
						}
						count_click = 0;
					}
				}
			}
		});

	});
}

$('#button').click(() => {
	start = true;
	++counterClickStart;
	if (counterClickStart < 2) {// контроль от двойного клика на кнопку старт (что бы не было бага с наслаиванием времени)
		beginGame();
		start_time();
	}

}

);

function start_time() {
	$('#timer').text('00:00.000')
	var this_date = new Date();
	var time;
	start_time_interval = setInterval(function () {
		var new_date = new Date() - this_date;
		var msec = Math.abs(Math.floor(new_date) % 1000); //millisek
		var sec = Math.abs(Math.floor(new_date / 1000) % 60); //sek
		var min = Math.abs(Math.floor(new_date / 1000 / 60) % 60); //min	
		if (sec.toString().length == 1) sec = '0' + sec;
		if (min.toString().length == 1) min = '0' + min;
		time = `${min + ':' + sec + '.' + msec}`;
		if (stop) yourResult = 'Вы выиграли!\nЗатраченное вермя: ' + time;
		else $('#timer').text(time);
	});

};

function stopGame() {
	alert(yourResult);
	location.reload();
};