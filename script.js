// Функция для загрузки и обработки текстового файла
async function loadTextFile() {
    const response = await fetch('data.txt');
    const text = await response.text();

    // Обрабатываем текст, разделяя его на объекты (например, разделяем по пустым строкам)
    const objects = text.split('\n\n');  // предположим, что каждый объект отделяется пустой строкой
    const objectListContainer = document.getElementById('object-list');

    // Для каждого объекта создаем элемент в списке
    objects.forEach((objectText, index) => {
        const object = createObjectElement(objectText, index);
        objectListContainer.appendChild(object);
    });
}
// Функция для создания объекта
function createObjectElement(objectText, index) {
    const objectList = document.getElementById('object-list');

    function splitTextByFragment(text) {
        const fragment = "NULL, NULL),"; // Это фрагмент, после которого будем обрезать строку
        const regex = new RegExp(`(.*?${fragment.replace(')', '\\)')})`, 'g'); // Экранируем круглую скобку в регулярном выражении

        // Ищем все фрагменты в тексте
        const matches = [...text.matchAll(regex)];

        // Извлекаем только совпавшие фрагменты (включая фрагмент "NULL, NULL),")
        const result = matches.map(match => match[0]);

        return result;
    }

    // Пример использования
    const result = splitTextByFragment(objectText);
    console.log(result);
    // Разбиваем каждый объект по строкам
    result.forEach((line, index) => {
        const objectElement = document.createElement('div');
        objectElement.classList.add('object');  // Добавляем класс object
        const header = document.createElement('h3');
        header.textContent = `${index + 1}. Объект ${line.slice(1, 6)}`;
        objectElement.appendChild(header);

        const content = document.createElement('div');
        content.classList.add('object-content');


        const [key, ...valueParts] = line.split(':').map(part => part.trim());
        if (key && valueParts.length > 0) {
            // Собираем все части после первого двоеточия в одно значение
            let value = valueParts.join(':');

            // Убираем все обратные слэши
            value = value.replace(/\\/g, '');

            // Заменяем каждую запятую на <br> для переноса на новую строку
            value = value.replace(/,/g, '<br>');

            // Создаем элемент div с ключом и значением
            const div = document.createElement('div');
            div.classList.add('key-value');
            div.innerHTML = `<span class="key">${key}:</span> <span class="value">${value}</span>`;
            content.appendChild(div);
        }
        objectElement.addEventListener('click', () => {
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
        });
        objectElement.appendChild(content);
        objectList.appendChild(objectElement);
    });

    // Обработчик клика для показа/скрытия содержимого объекта

    return objectList;
}

// Загружаем данные при загрузке страницы
window.onload = loadTextFile;
