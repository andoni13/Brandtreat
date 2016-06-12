'use strict';

angular.module('brandtreat.services', ['ngResource'])
	.constant('baseURL', 'http://192.168.0.56:3000/')
	.factory('registerFactory', ['$resource', 'localStorage', 'baseURL', function($resource, localStorage, baseURL) {
		return {
			register: function (data, onSuccess, onError) {
				var options = new FileUploadOptions();
				var params = {};
				params.user = data;
				options.fileKey = 'avatar';
				options.params = params;

				var ft = new FileTransfer();
				ft.upload(data.avatar, baseURL + 'api/user/register', function (result) {
					onSuccess(result.response, result.headers);
				}, function (error) {
					var customError = {
						status: error.http_status,
						data: JSON.parse(error.body)
					};
					onError(customError);
				}, options);
			}
		}
	}])
	.factory('loginFactory', ['$resource', 'baseURL', function($resource, baseURL) {
		return $resource(baseURL + 'api/sessions/create', null, {
			'login': {
				method: 'POST'
			}
		});
	}])
	.factory('localStorage', ['$window', function($window) {
		return {
			store: function(key, value) {
				$window.localStorage[key] = value;
			},
			get: function(key, defaultValue) {
				return $window.localStorage[key] || defaultValue;
			},
			storeObject: function(key, value) {
				$window.localStorage[key] = JSON.stringify(value);
			},
			getObject: function(key, defaultValue) {
				defaultValue = defaultValue || 'null';
				var result = {};
				try {
					result = JSON.parse($window.localStorage[key] || defaultValue);	
				} catch (error) {
					console.log('LOCAL STORAGE ERROR', error);
				}
				return result;
			}
		}
	}])
	.factory('challengeFactory', [function() {

		var data = { 
			"challenges" : [
				{
					id: 0,
					brand: "Vive Deporte",
					logoSrc: "img/brands/vive-deporte.png",
					title: "Copa América Challenge",
					description: "Guess the soccer match scores during the Copa America. Every day matches will be 	updated and users will have the chance to predict the score.",
					participants: 200,
					maxParticipants: 500,
					reward: "Ecuador T-shirts",
					rewardIcon: "ion-tshirt-outline",
					category: "Sports Prediction",
					categoryIcon: "ion-ios-football-outline",
					constraint: "WiFi Smartphone",
					constraintIcon: "ion-wifi",
					timeToEnd: "3 days", 
					dateToEnd: "June 26th", 
					location: "Ecuador",
					dificulty: "medium",
					instructions: [
						{
							instruction: "Join the challenge"
						},
						{
							instruction: "Check the challenge daily to check the games"
						},
						{
							instruction: "Predict the final result of every match"
						},
						{
							instruction: "Save your prediction 30 minutes before the match begins"
						},
						{
							instruction: "Wait fo the results to update"
						},
						{
							instruction: "Check your ranking to win rewards"
						}
					],
					terms: [
						{
							condition: "The challenge is open to unlimeted users"
						},
						{
							condition: "For every score that a user prediction matches the user will earn 3pts for the challenge ranking"
						},
						{
							condition: "Predict the final result of every match"
						},
						{
							condition: "Save your prediction 30 minutes before the match begins"
						}
					]
				},
				{
					id: 1,
					brand: "Dispatch Ads",
					logoSrc: "img/brands/dispatch-ads.png",
					title: "Trivia Challenge",
					description: "Daily question, select the right answer to win many prizes. Questions are from different topics. Good Luck!",
					participants: 80,
					maxParticipants: 150,
					reward: "Life free suscription",
					rewardIcon: "ion-ios-infinite",
					category: "Trivia",
					categoryIcon: "ion-ios-lightbulb-outline",
					constraint: "WiFi Smartphone",
					constraintIcon: "ion-wifi",
					timeToEnd: "5 days", 
					dateToEnd: "June 28th", 
					location: "Guayaquil",
					dificulty: "easy",
					instructions: [
						{
							instruction: "Join the challenge"
						},
						{
							instruction: "Check the challenge daily to check the games"
						},
						{
							instruction: "Predict the final result of every match"
						},
						{
							instruction: "Save your prediction 30 minutes before the match begins"
						},
						{
							instruction: "Wait fo the results to update"
						},
						{
							instruction: "Check your ranking to win rewards"
						}
					],
					terms: [
						{
							condition: "The challenge is open to unlimeted users"
						},
						{
							condition: "For every score that a user prediction matches the user will earn 3pts for the challenge ranking"
						},
						{
							condition: "Predict the final result of every match"
						},
						{
							condition: "Save your prediction 30 minutes before the match begins"
						}
					]
				},
				{
					id: 2,
					brand: "Blanc",
					logoSrc: "img/brands/blanc.png",
					title: "Guess the Score",
					description: "Do you know who will the next NBA game will end?, guess what?, if you guess right you win!",
					participants: 900,
					maxParticipants: '',
					reward: "50% down",
					rewardIcon: "ion-ios-pricetags-outline",
					category: "Sports Prediction",
					categoryIcon: "ion-ios-football-outline",
					constraint: "WiFi Smartphone",
					constraintIcon: "ion-wifi",
					timeToEnd: "7 days",
					dateToEnd: "June 30th",
					location: "New York",
					dificulty: "medium",
					instructions: [
						{
							instruction: "Join the challenge"
						},
						{
							instruction: "Check the challenge daily to check the games"
						},
						{
							instruction: "Predict the final result of every match"
						},
						{
							instruction: "Save your prediction 30 minutes before the match begins"
						},
						{
							instruction: "Wait fo the results to update"
						},
						{
							instruction: "Check your ranking to win rewards"
						}
					],
					terms: [
						{
							condition: "The challenge is open to unlimeted users"
						},
						{
							condition: "For every score that a user prediction matches the user will earn 3pts for the challenge ranking"
						},
						{
							condition: "Predict the final result of every match"
						},
						{
							condition: "Save your prediction 30 minutes before the match begins"
						}
					]
				}, 
				{
					id: 3,
					brand: "Grupo Tribu",
					logoSrc: "img/brands/tribu.png",
					title: "Social Post",
					description: "If you truly beleive our designs are cool please share our info in your facebook wall.",
					participants: 210,
					maxParticipants: '',
					reward: "New Logo",
					rewardIcon: "ion-paintbrush",
					category: "Social Media",
					categoryIcon: "ion-earth",
					constraint: "Facebook Account",
					constraintIcon: "ion-social-facebook-outline",
					timeToEnd: "10 days", 
					dateToEnd: "July 2nd",
					location: "Peru",
					dificulty: "hard",
					instructions: [
						{
							instruction: "Join the challenge"
						},
						{
							instruction: "Check the challenge daily to check the games"
						},
						{
							instruction: "Predict the final result of every match"
						},
						{
							instruction: "Save your prediction 30 minutes before the match begins"
						},
						{
							instruction: "Wait fo the results to update"
						},
						{
							instruction: "Check your ranking to win rewards"
						}
					],
					terms: [
						{
							condition: "The challenge is open to unlimeted users"
						},
						{
							condition: "For every score that a user prediction matches the user will earn 3pts for the challenge ranking"
						},
						{
							condition: "Predict the final result of every match"
						},
						{
							condition: "Save your prediction 30 minutes before the match begins"
						}
					]
				},
				{
					id: 4,
					brand: "Security Guide",
					logoSrc: "img/brands/security-guide.png",
					title: "Checkpoint",
					description: "Just do a checkpoint in your house and in any other 5 houses that use Security Guide and win!",
					participants: 30,
					maxParticipants: '',
					reward: "An Awesome Key",
					rewardIcon: "ion-key",
					category: "Navigation",
					categoryIcon: "ion-ios-navigate-outline",
					constraint: "Geolocalization",
					constraintIcon: "ion-android-locate",
					timeToEnd: "25 days",
					dateToEnd: "July 16th", 
					location:"Worldwide",
					dificulty: "hard",
					instructions: [
						{
							instruction: "Join the challenge"
						},
						{
							instruction: "Check the challenge daily to check the games"
						},
						{
							instruction: "Predict the final result of every match"
						},
						{
							instruction: "Save your prediction 30 minutes before the match begins"
						},
						{
							instruction: "Wait fo the results to update"
						},
						{
							instruction: "Check your ranking to win rewards"
						}
					],
					terms: [
						{
							condition: "The challenge is open to unlimeted users"
						},
						{
							condition: "For every score that a user prediction matches the user will earn 3pts for the challenge ranking"
						},
						{
							condition: "Predict the final result of every match"
						},
						{
							condition: "Save your prediction 30 minutes before the match begins"
						}
					]
				}
			
			]
		}

		return {
			getChallenges: function() {
				return data.challenges;
			},
			getChallenge: function(id) {
				return data.challenges[id];
			}
		}
}]);

