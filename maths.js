const Iterations_map = new Map();

const add_iteration = (number_of_iterations) => {
	if (Iterations_map.has(number_of_iterations)) {
		Iterations_map.set(number_of_iterations, Iterations_map.get(number_of_iterations) + 1);
	} else {
		Iterations_map.set(number_of_iterations, 1);
	}
}

const sort_map = (map) => {
	map = new Map([...map.entries()].sort((a, b) => a[0] - b[0]));
	return map;
}

const convert_map_to_bar_chart = (map) => {
	const datasets = {
		barPercentage: 0.5,
		barThickness: 6,
		maxBarThickness: 8,
		minBarLength: 2,
		data: Array.from(map.values()),
		backgroundColor: create_random_colors(map),
	}
	return datasets;
}

const create_random_colors = (map) => {
	// create a gradient between the two colors
	const max_value = Math.max(...Array.from(map.values()));
	const min_value = Math.min(...Array.from(map.values()));
	const colors = [];
	for (let i = 0; i < map.size; i++) {
		const value = Array.from(map.values())[i];
		const color = create_random_color_hex(min_value, max_value, value);
		colors.push(color);
	}
	return colors;
}

const create_random_color_hex = (min_value, max_value, value) => {

	const percent = (max_value - value) / (max_value - min_value)
	const r = 0;
	const g = 0;
	const b = Math.abs(Math.floor(255 * (percent)));

	let color = "#" + r.toString(16) + g.toString(16) + b.toString(16);

	// check color integrity, it has to be 7 characters long
	if (color.length > 7) {
		color = color.substring(0, 7);
	}
	while (color.length < 7) {
		color = color + "9";
	}

	return color;
}

const apply_rules = (number) => {
	if (number % 2 == 0) {
		number = number / 2;
	} else if (number % 2 == 1) {
		number = number * 3 + 1;
	}
	return number;
}

const recursive = (number, counter) => {
	counter++;
	if (number != 1 && number != 4 && number != 2) {
		return recursive(apply_rules(number), counter);
	} else {
		return counter;
	}
}


const test = () => {
	const max_numers = [100, 1000, 10000, 100000, 1000000, 10000000]
	for (let j = 0; j < max_numers.length; j++) {
		Iterations_map.clear();
		for (let i = 1; i <= max_numers[j]; i++) {
			try {
				const iterations = recursive(i, 0);
				add_iteration(iterations);
				// console.log("\nNumber:" + i + " | Iterations: " + iterations);
			} catch (error) {
				console.log("\nError on: " + i + " | " + error);
			}
		}
		// graph the map with Chart.js, as bar chart
		const datasets = convert_map_to_bar_chart(Iterations_map);
		new Chart(document.getElementById("grid-" + (j + 1)), {
			type: 'bar',
			data: {
				labels: Array.from(Iterations_map.keys()),
				datasets: [datasets]
			},
			options: {
				legend: { display: false },
				title: {
					display: true,
					text: 'Iterations for numbers up to ' + max_numers[j]
				},
			}
		});
	}



}

test();