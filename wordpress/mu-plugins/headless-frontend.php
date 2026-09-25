<?php
/**
 * Plugin Name: Headless frontend support
 * Description: Lets the Next.js site (sriramakrishna.in) fetch WordPress feeds, sitemaps and pages from the WordPress host without being redirected back to itself.
 *
 * Install: upload this file to wp-content/mu-plugins/ (create the folder if needed).
 * Must-use plugins are active automatically and don't appear in the Plugins list toggle.
 *
 * Setup it supports (Settings → General):
 *   WordPress Address (URL): https://www.sriramakrishna.in   ← admin, REST API, uploads
 *   Site Address (URL):      https://sriramakrishna.in       ← the Next.js site on Vercel
 *
 * With that setup, WordPress sends visitors who open a page on www to the same
 * page on the main domain (good for SEO: one address per page). The frontend's
 * own server-side requests carry the X-Headless-Frontend header; for those,
 * the redirect is skipped so WordPress answers directly.
 */

if (!defined('ABSPATH')) {
	exit;
}

add_action('init', function () {
	if (!empty($_SERVER['HTTP_X_HEADLESS_FRONTEND'])) {
		remove_action('template_redirect', 'redirect_canonical');
	}
});
