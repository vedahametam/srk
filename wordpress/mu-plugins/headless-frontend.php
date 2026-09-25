<?php
/**
 * Plugin Name: Headless frontend support
 * Description: Connects WordPress to the Next.js site (sriramakrishna.in): lets it fetch feeds and sitemaps without redirect loops, and refreshes it when content is published.
 *
 * Install: upload this file to wp-content/mu-plugins/ (create the folder if needed).
 * Must-use plugins are active automatically.
 *
 * To refresh the site immediately when something is published, add to wp-config.php
 * (above the line "That's all, stop editing!"):
 *   define( 'SRK_FRONTEND_URL', 'https://sriramakrishna.in' );
 *   define( 'SRK_REVALIDATE_SECRET', 'the same value as REVALIDATE_SECRET in Vercel' );
 * Without these, the site still picks up changes within a day.
 */

if (!defined('ABSPATH')) {
	exit;
}

// The site's own server-side requests (feeds, sitemaps) carry this header:
// answer them directly instead of redirecting to the Site Address.
add_action('init', function () {
	if (!empty($_SERVER['HTTP_X_HEADLESS_FRONTEND'])) {
		remove_action('template_redirect', 'redirect_canonical');
	}
});

/** Asks the site to refresh its cached WordPress content. Sent at most once per request. */
function srk_refresh_frontend() {
	static $sent = false;
	if ($sent || !defined('SRK_FRONTEND_URL') || !defined('SRK_REVALIDATE_SECRET')) {
		return;
	}
	$sent = true;
	wp_remote_post(
		untrailingslashit(SRK_FRONTEND_URL) . '/api/revalidate/?secret=' . rawurlencode(SRK_REVALIDATE_SECRET),
		array('timeout' => 5, 'blocking' => false)
	);
}

// Publishing, updating, unpublishing or trashing a post or page.
add_action('transition_post_status', function ($new_status, $old_status, $post) {
	if (wp_is_post_revision($post) || wp_is_post_autosave($post)) {
		return;
	}
	if ('publish' === $new_status || 'publish' === $old_status) {
		srk_refresh_frontend();
	}
}, 10, 3);

// Category and tag changes, and approved comments.
add_action('edited_term', 'srk_refresh_frontend');
add_action('delete_term', 'srk_refresh_frontend');
add_action('wp_set_comment_status', 'srk_refresh_frontend');
add_action('comment_post', function ($comment_id, $approved) {
	if (1 === $approved) {
		srk_refresh_frontend();
	}
}, 10, 2);
