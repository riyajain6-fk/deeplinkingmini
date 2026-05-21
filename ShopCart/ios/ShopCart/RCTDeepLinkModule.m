#import "RCTDeepLinkModule.h"
#import "DeepLinkManager.h"

@implementation RCTDeepLinkModule

RCT_EXPORT_MODULE(DeepLinkModule);

- (NSArray<NSString *> *)supportedEvents
{
  return @[ @"DeepLinkReceived" ];
}

- (void)startObserving
{
  [[NSNotificationCenter defaultCenter]
      addObserver:self
         selector:@selector(handleDeepLinkNotification:)
             name:@"DeepLinkReceivedNotification"
           object:nil];
}

- (void)stopObserving
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)handleDeepLinkNotification:(NSNotification *)notification
{
  NSString *url = notification.userInfo[@"url"];
  if (url.length > 0) {
    [self sendEventWithName:@"DeepLinkReceived" body:@{@"url" : url}];
  }
}

RCT_EXPORT_METHOD(notifyNavigationReady)
{
  [[DeepLinkManager shared] markNavigationReady];
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

@end
