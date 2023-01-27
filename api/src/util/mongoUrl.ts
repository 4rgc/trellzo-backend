class MongoUrl extends Object {
	private _hosts: string[];
	private _ports: number[];
	private _username: string;
	private _password: string;
	private _database: string;
	private _ssl: boolean;
	private _replicaSet: string;
	private _authSource: string;

	constructor(hosts: string[], ports: number[], database: string) {
		super();
		this._hosts = hosts;
		this._ports = ports;
		this._database = database;
		this._username = '';
		this._password = '';
		this._ssl = false;
		this._replicaSet = '';
		this._authSource = '';
	}

	username(username?: string): MongoUrl {
		if (username) this._username = username;
		return this;
	}

	password(password?: string): MongoUrl {
		if (password) this._password = password;
		return this;
	}

	ssl(ssl?: boolean): MongoUrl {
		if (ssl) this._ssl = true;
		return this;
	}

	replicaSet(replicaSet?: string): MongoUrl {
		if (replicaSet) this._replicaSet = replicaSet;
		return this;
	}

	authSource(authSource?: string) {
		if (authSource) this._authSource = authSource;
		return this;
	}

	override toString(): string {
		let returnUrl = 'mongodb://';
		const urlParams = [];
		if (this._username !== '' && this._password !== '') {
			returnUrl += `${this._username}:${this._password}@`;
		}
		const hosts = this._hosts.map(
			(host, index) => `${host}:${this._ports[index]}`
		);
		returnUrl += hosts.join(',');
		returnUrl += `/${this._database}`;
		if (this._ssl) urlParams.push('ssl=true');
		if (this._replicaSet !== '')
			urlParams.push(`replicaSet=${this._replicaSet}`);
		if (this._authSource !== '')
			urlParams.push(`authSource=${this._authSource}`);
		if (urlParams.length > 0) returnUrl += `?${urlParams.join('&')}`;
		return returnUrl;
	}
}

export default MongoUrl;
