const iterations_map = new Map();

const add_iteration = (number_of_iterations) => {
	if (iterations_map.has(number_of_iterations)) {
		iterations_map.set(number_of_iterations, iterations_map.get(number_of_iterations) + 1);
	} else {
		iterations_map.set(number_of_iterations, 1);
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

const optimize_recursive = (number, counter, invalid_numbers) => {
	counter++;
	const contains = invalid_numbers.includes(number);
	if (contains) {
		return counter;
	}
	return optimize_recursive(apply_rules(number), counter, invalid_numbers);
}

const optimize_recursive_divide = (number, counter, invalid_numbers) => {
	counter++;
	const contains = find_in_array(number, invalid_numbers)
	if (contains) {
		return counter;
	}
	return optimize_recursive_divide(apply_rules(number), counter, invalid_numbers);
}


const find_in_array = (number, array) => {
	// find in array sorted, by dividing the array in two and checking if the number is bigger or smaller than the middle number

	if (array.length == 0) {
		return false;
	}
	if (array.length == 1) {
		return number == array[0];
	}
	const middle = Math.floor(array.length / 2);
	if (number < array[middle]) {
		return find_in_array(number, array.slice(0, middle));
	}
	if (number > array[middle]) {
		return find_in_array(number, array.slice(middle, array.length));
	}
	if (number == array[middle]) {
		return true;
	}
}

const generate_graphs = () => {
	const max_numbers = [100, 1000, 10000, 100000, 1000000, 10000000]
	for (let j = 0; j < max_numbers.length; j++) {
		iterations_map.clear();
		for (let i = 1; i <= max_numbers[j]; i++) {
			try {
				const iterations = recursive(i, 0);
				add_iteration(iterations);
				// console.log("\nNumber:" + i + " | Iterations: " + iterations);
			} catch (error) {
				console.log("\nError on: " + i + " | " + error);
			}
		}
		// graph the map with Chart.js, as bar chart
		const datasets = convert_map_to_bar_chart(iterations_map);
		new Chart(document.getElementById("grid-" + (j + 1)), {
			type: 'bar',
			data: {
				labels: Array.from(iterations_map.keys()),
				datasets: [datasets]
			},
			options: {
				legend: { display: false },
				title: {
					display: true,
					text: 'Iterations for numbers up to ' + max_numbers[j]
				},
			}
		});
	}
}

const generate_optimized_graph = () => {
	const invalid_numbers = [1];
	iterations_map.clear();
	const max_number = 10000;
	const start_time = new Date().getTime();
	for (let i = 1; i < max_number; i++) {
		try {
			const iterations = optimize_recursive(i, 0, invalid_numbers);
			add_iteration(iterations);
			invalid_numbers.push(i);
			invalid_numbers.sort((a, b) => a - b);

			// console.log("\nNumber:" + i + " | Iterations: " + iterations);
		} catch (error) {
			console.log("\nError on: " + i + " | " + error);
		}
	}
	const end_time = new Date().getTime();

	const datasets = convert_map_to_bar_chart(iterations_map);
	new Chart(document.getElementById("grid-opt"), {
		type: 'bar',
		data: {
			labels: Array.from(iterations_map.keys()),
			datasets: [datasets]
		},
		options: {
			legend: { display: false },
			title: {
				display: true,
				text: 'Iterations for numbers up to ' + max_number
			},
		}
	});

	const percentage_container = document.getElementById("percentage_container");
	const percentage_span = document.getElementById("percentage");
	const percentage = datasets.data[1] / max_number * 100.000;
	percentage_span.innerHTML = percentage.toFixed(3) + "%";

	const performance_includes = document.getElementById("performance_includes");
	percentage_container.style.display = "block";
}

// ENTRY POINT

document.addEventListener("DOMContentLoaded", function () {
	document.getElementById("generate_graphs").addEventListener("click", generate_graphs);
	document.getElementById("generate_optimized_graph").addEventListener("click", generate_optimized_graph);
});


