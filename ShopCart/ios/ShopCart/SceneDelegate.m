#import "SceneDelegate.h"
#import "DeepLinkManager.h"

@implementation SceneDelegate

- (void)scene:(UIScene *)scene
    continueUserActivity:(NSUserActivity *)userActivity
{
  if (![userActivity.activityType isEqualToString:NSUserActivityTypeBrowsingWeb]) {
    return;
  }

  NSURL *url = userActivity.webpageURL;
  if (url != nil) {
    [[DeepLinkManager shared] storeIncomingURL:url.absoluteString];
  }
}

- (void)scene:(UIScene *)scene openURLContexts:(NSSet<UIOpenURLContext *> *)URLContexts
{
  for (UIOpenURLContext *context in URLContexts) {
    NSURL *url = context.URL;
    if (url != nil) {
      [[DeepLinkManager shared] storeIncomingURL:url.absoluteString];
    }
  }
}

@end
