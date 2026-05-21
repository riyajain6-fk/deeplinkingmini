#import "DeepLinkManager.h"

@implementation DeepLinkManager

+ (instancetype)shared
{
  static DeepLinkManager *instance;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    instance = [[DeepLinkManager alloc] init];
  });
  return instance;
}

- (void)storeIncomingURL:(NSString *)url
{
  if (url.length == 0) {
    return;
  }
  NSLog(@"[DeepLinkManager] Stored pending URL: %@", url);
  self.pendingDeepLink = url;
  [self flushPendingDeepLink];
}

- (void)markNavigationReady
{
  NSLog(@"[DeepLinkManager] Navigation ready");
  self.isNavigationReady = YES;
  [self flushPendingDeepLink];
}

- (void)flushPendingDeepLink
{
  if (!self.isNavigationReady || self.pendingDeepLink.length == 0) {
    return;
  }

  NSString *url = self.pendingDeepLink;
  self.pendingDeepLink = nil;

  NSLog(@"[DeepLinkManager] Flushing URL to React Native: %@", url);
  [[NSNotificationCenter defaultCenter]
      postNotificationName:@"DeepLinkReceivedNotification"
                    object:nil
                  userInfo:@{@"url" : url}];
}

@end
