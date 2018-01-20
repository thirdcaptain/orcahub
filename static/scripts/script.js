$(function () {
    let access_token = Cookies.get('access_token');
    if (access_token === undefined) {
	access_token = localStorage.getItem('access_token');
	if (access_token === null) {
	    window.location = 'https://orcas.holberton.us';
	}
    } else {
	localStorage.setItem('access_token', access_token);
    }
    let data = {'access_token': access_token};
    $.getJSON('https://api.github.com/user', data, function (user) {
	$.getJSON(user.repos_url, data, function (repos) {
	    repos.forEach(function (repo) {
		let isPrivate;
		if (repo.private === true) {
		    isPrivate = 'Private';
		} else {
		    isPrivate = 'Public';
		}

		let li = document.createElement('li');
		$(li).data('name', repo.name);

		let div = document.createElement('div');
		$(div).addClass('reponame');

		let h3 = document.createElement('h3');
		$(h3).text(repo.name);

		let p = document.createElement('p');
		$(p).addClass('pr-pb');
		$(p).text(isPrivate);
		
		$(div).append(h3);
		$(div).append(p);
		$(li).append(div);

		$(li).click(function () {
		    $.getJSON(repo.url + '/stats/commit_activity', data, function (activity) {
			let frontTags = '<div class="dropdown-content"><table class="main-table"><tr><th class="fixed-side" id="empty">&nbsp;</th><th>Sunday</th><th>Monday</th><th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th><th>Saturday</th></tr>';
			let middleTags = '';
			activity.forEach(function (week, i) {
			    middleTags += '<tr><td>' + i + '<td>';
			    let days = {
				0: 'Sunday',
				1: 'Monday',
				2: 'Tuesday',
				3: 'Wednesday',
				4: 'Thursday',
				5: 'Friday',
				6: 'Saturday'
			    };
			    console.log(week);
			    week.days.forEach(function (commitsPerDay, j) {
				middleTags += '<td>';
				middleTags += days[j];
				middleTags += '</td>';
				middleTags += '<td>';
				middleTags += commitsPerDay;
				middleTags += '</td>';
			    });
			    middleTags += '</tr>';
			});
			let endTags = '</table></div>';
			$(h3).after(frontTags + middleTags + endTags);
		    });
		});
		$('ul.repos').append(li);
	    });
	});
    });
});
