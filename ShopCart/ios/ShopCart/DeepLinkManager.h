#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface DeepLinkManager : NSObject

+ (instancetype)shared;

@property (nonatomic, copy, nullable) NSString *pendingDeepLink;
@property (nonatomic, assign) BOOL isNavigationReady;

- (void)storeIncomingURL:(NSString *)url;
- (void)markNavigationReady;
- (void)flushPendingDeepLink;

@end

NS_ASSUME_NONNULL_END
