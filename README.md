### BWH Hive

Modern Project Management Software

### Installation

You can install this app using the [bench](https://github.com/frappe/bench) CLI:

```bash
cd $PATH_TO_YOUR_BENCH
bench get-app $URL_OF_THIS_REPO --branch develop
bench install-app bwh_hive
```

### Development

The backend is a Frappe app (`bwh_hive/`). The frontend is a Vue 3 + TypeScript
single-page app (`frontend/`) built on [frappe-ui](https://github.com/frappe/frappe-ui),
served at `/hive`.

```bash
yarn install          # installs the frontend too
yarn dev              # Vite dev server on :8080, proxying API and assets to bench on :8000
yarn build            # builds to bwh_hive/public/frontend/ and writes bwh_hive/www/hive.html
yarn test:e2e         # Playwright end-to-end suite
```

### Contributing

This app uses `pre-commit` for code formatting and linting. Please [install pre-commit](https://pre-commit.com/#installation) and enable it for this repository:

```bash
cd apps/bwh_hive
pre-commit install
```

Pre-commit is configured to use the following tools for checking and formatting your code:

- ruff
- eslint
- prettier
- pyupgrade
### CI

This app can use GitHub Actions for CI. The following workflows are configured:

- CI: Installs this app and runs unit tests on every push to `develop` branch.
- Linters: Runs [Frappe Semgrep Rules](https://github.com/frappe/semgrep-rules) and [pip-audit](https://pypi.org/project/pip-audit/) on every pull request.


### License

agpl-3.0
